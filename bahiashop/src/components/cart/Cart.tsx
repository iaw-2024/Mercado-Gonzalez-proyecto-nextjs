"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { buttonVariants } from "../ui/button";
import Image from "next/image";
import { Cart, useGlobalContext } from "@/context/StoreProvider";
import CartItem from "@/components/cart/CartItem";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartComponent = () => {
  const { cart, getCartByUserId } = useGlobalContext();
  const { data: session } = useSession();
  const router = useRouter();
  const [hasOutOfStock, setHasOutOfStock] = useState(false); // Estado para verificar si hay productos sin stock

  useEffect(() => {
    if (session && session.user && session.user.user_id) {
      getCartByUserId(session.user.user_id);
    }
  }, [session]);

  let sum = 0;
  cart.forEach((p) => (sum += p.price * p.quantity));

  let totalItems = 0;
  cart.forEach((product) => {
    totalItems += product.quantity;
  });

  useEffect(() => {
    // Verificar si hay productos sin stock
    const hasOutOfStockProducts = cart.some((product) => product.stock <= 0);
    setHasOutOfStock(hasOutOfStockProducts);
  }, [cart]);

  const handleFinalizePurchase = () => {
    // Lógica para finalizar la compra
    if (hasOutOfStock) {
      // Mostrar toast de error si hay productos sin stock
      toast.error("¡Hay productos sin stock en el carrito!", {
        position: "top-left",
        style: {
          width: "300px",
          fontSize: "1rem",
        },
      });
    } else {
      router.push("/payment");
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2">
        <ShoppingCart
          aria-hidden="true"
          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {totalItems}
        </span>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto fkex w-full flex-col pr-0 sm:max-w-lg max-h-[calc(100vh-64px)]">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle> Mi Carrito ({totalItems})</SheetTitle>
        </SheetHeader>
        {cart.length > 0 ? (
          <>
            <div className="lex w-full flex-col pr-6">
              {cart.map((product: Cart) => (
                <CartItem
                  key={product.cart_item_id}
                  product={product}
                  user_id={session?.user?.user_id}
                />
              ))}
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Envio</span>
                  <span>Gratis</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>${sum.toLocaleString()}</span>
                </div>
              </div>

              <SheetFooter>
                <SheetTrigger asChild>
                  <button
                    onClick={handleFinalizePurchase}
                    className={buttonVariants({ className: "w-full" })}
                  >
                    Finalizar Compra
                  </button>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div
              aria-hidden="true"
              className="relative mb-4 h-60 w-60 text-muted-foreground"
            >
              <Image src="/EmptyCart.webp" fill alt=" empty shopping cart" />
            </div>
            <div className="text-xl font-semibold"> Tu carrito esta vacio</div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartComponent;
