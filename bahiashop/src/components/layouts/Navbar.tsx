"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "../ui/button";
import Cart from "../cart/Cart";
import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { isAdmin } from "@/lib/utils";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useGlobalContext } from "@/context/StoreProvider";
import { toast } from "react-toastify";

const Navbar = () => {
  const { setSearch } = useGlobalContext();
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [admin, setAdmin] = useState<boolean>(false);

  useEffect(() => {
    setAdmin(session ? isAdmin(session) : false);
  }, [session]);

  // Función para manejar el cierre de sesión
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setSearch("");
    toast.success("Has cerrado sesión con éxito.");
    router.push("/");
  };

  return (
    <div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <Image src="/logo.webp" alt="logo" width={70} height={50} />
                </Link>
              </div>

              <div className="flex items-center space-x-4 lg:space-x-6">
                {session ? (
                  <>
                    {admin && (
                      <Link
                        href="/admin"
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        PANEL ADMIN
                      </Link>
                    )}
                    <strong className="text-gray-700 text-sm">
                      {session.user.nombre.toUpperCase()}
                    </strong>
                    <button
                      onClick={handleSignOut}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      CERRAR SESIÓN
                    </button>
                    <div className="ml-4 flow-root lg:ml-6">
                      <Cart />
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/SignIn"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      INICIAR SESIÓN
                    </Link>
                    <span
                      className="hidden lg:block h-6 w-px bg-gray-200"
                      aria-hidden="true"
                    />
                    <Link
                      href="/SignUp"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      REGISTRARSE
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
