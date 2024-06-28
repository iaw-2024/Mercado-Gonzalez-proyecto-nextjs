"use client";

import React, { ChangeEvent, useState, useEffect } from "react";
import MaxWidthWrapper from "@/components/layouts/MaxWidthWrapper";
import MPButton from "@/components/payment/MPButton";
import { MPProvider } from "@/context/MPProvider";
import { useGlobalContext } from "@/context/StoreProvider";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "react-loader-spinner";

const Payment = () => {
  const { cart, setSearch } = useGlobalContext();
  const { data: session } = useSession();
  const router = useRouter();

  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");

  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({
    email: false,
    firstName: false,
    lastName: false,
    address: false,
    province: false,
    zipCode: false,
  });

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Calcular subtotal
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal;

  // Calcular productos para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cart.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleZipCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
    if (value.length <= 4) {
      setZipCode(value);
    }
  };

  const handleSubmit = () => {
    const newErrors = {
      email: email === "",
      firstName: firstName === "",
      lastName: lastName === "",
      address: address === "",
      province: province === "",
      zipCode: zipCode === "",
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);
    return !hasErrors; // Devuelve true si no hay errores, false si hay al menos uno
  };

  const handleInputChange =
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      field: keyof typeof errors
    ) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
      if (errors[field]) {
        setErrors({ ...errors, [field]: false });
      }
    };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch("");
      const hasOutOfStockItems = cart.some((item) => item.stock === 0);
      if (!session || cart.length < 1 || hasOutOfStockItems) {
        router.push("/");
      } else {
        setLoading(false);
        setFirstName(session.user.nombre ?? "");
        setLastName(session.user.apellido ?? "");
        setEmail(session.user.email ?? "");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [session, cart.length, router]);

  if (loading) {
    return (
      <MaxWidthWrapper>
        <div className="flex justify-center items-center h-screen">
          <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={1000}
          />
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <MPProvider>
      <MaxWidthWrapper>
        <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
          <div className="px-4 pt-8">
            <p className="text-xl font-medium">Resumen de Compra</p>
            <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
              {currentItems.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="flex flex-col rounded-lg bg-white sm:flex-row"
                >
                  <CldImage
                    src={item.image_path}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                  />
                  <div className="flex w-full flex-col px-4 py-4">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-gray-400">
                      Cantidad: {item.quantity}
                    </span>
                    <p className="text-lg font-bold">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Paginación */}
            <div className="flex justify-center mt-4">
              {Array.from(
                { length: Math.ceil(cart.length / itemsPerPage) },
                (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`mx-1 px-3 py-1 border ${
                      currentPage === index + 1 ? "bg-gray-200" : "bg-white"
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
            <p className="text-xl font-medium">Detalles de compra</p>
            <div className="">
              <label
                htmlFor="first-name"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Nombre
              </label>
              <input
                type="text"
                id="first-name"
                name="first-name"
                className={`w-full rounded-md border px-4 py-3 text-sm shadow-sm outline-none focus:z-10 ${
                  errors.firstName ? "border-red-500" : "border-gray-200"
                } focus:border-blue-500 focus:ring-blue-500`}
                placeholder="Nombre"
                value={firstName}
                onChange={handleInputChange(setFirstName, "firstName")}
              />
              <label
                htmlFor="last-name"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Apellido
              </label>
              <input
                type="text"
                id="last-name"
                name="last-name"
                className={`w-full rounded-md border px-4 py-3 text-sm shadow-sm outline-none focus:z-10 ${
                  errors.lastName ? "border-red-500" : "border-gray-200"
                } focus:border-blue-500 focus:ring-blue-500`}
                placeholder="Apellido"
                value={lastName}
                onChange={handleInputChange(setLastName, "lastName")}
              />
              <label
                htmlFor="email"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  name="email"
                  className={`w-full rounded-md border px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } focus:border-blue-500 focus:ring-blue-500`}
                  placeholder="email@gmail.com"
                  value={email}
                  onChange={handleInputChange(setEmail, "email")}
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>
              <label
                htmlFor="billing-address"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Direccion de Envio
              </label>
              <input
                type="text"
                id="billing-address"
                name="billing-address"
                className={`w-full rounded-md border px-4 py-3 text-sm shadow-sm outline-none focus:z-10 ${
                  errors.address ? "border-red-500" : "border-gray-200"
                } focus:border-blue-500 focus:ring-blue-500`}
                placeholder="Direccion de Envio"
                value={address}
                onChange={handleInputChange(setAddress, "address")}
              />
              <div className="flex flex-col sm:flex-row mt-4">
                <select
                  name="billing-state"
                  className={`w-full sm:w-auto sm:min-w-[185px] rounded-md border px-4 py-3 text-sm shadow-sm outline-none focus:z-10 ${
                    errors.province ? "border-red-500" : "border-gray-200"
                  } focus:border-blue-500 focus:ring-blue-500`}
                  value={province}
                  onChange={handleInputChange(setProvince, "province")}
                >
                  <option value="" disabled selected>
                    Provincia
                  </option>
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="Catamarca">Catamarca</option>
                  <option value="Chaco">Chaco</option>
                  <option value="Chubut">Chubut</option>
                  <option value="Córdoba">Córdoba</option>
                  <option value="Corrientes">Corrientes</option>
                  <option value="Entre Ríos">Entre Ríos</option>
                  <option value="Formosa">Formosa</option>
                  <option value="Jujuy">Jujuy</option>
                  <option value="La Pampa">La Pampa</option>
                  <option value="La Rioja">La Rioja</option>
                  <option value="Mendoza">Mendoza</option>
                  <option value="Misiones">Misiones</option>
                  <option value="Neuquén">Neuquén</option>
                  <option value="Río Negro">Río Negro</option>
                  <option value="Salta">Salta</option>
                  <option value="San Juan">San Juan</option>
                  <option value="San Luis">San Luis</option>
                  <option value="Santa Cruz">Santa Cruz</option>
                  <option value="Santa Fe">Santa Fe</option>
                  <option value="Santiago del Estero">
                    Santiago del Estero
                  </option>
                  <option value="Tierra del Fuego">Tierra del Fuego</option>
                  <option value="Tucumán">Tucumán</option>
                </select>

                <input
                  type="text"
                  name="billing-zip"
                  value={zipCode}
                  onChange={handleZipCodeChange}
                  className={`w-full sm:w-auto sm:min-w-[120px] rounded-md border px-4 py-3 text-sm shadow-sm outline-none focus:z-10 ${
                    errors.zipCode ? "border-red-500" : "border-gray-200"
                  } focus:border-blue-500 focus:ring-blue-500`}
                  placeholder="Codigo Postal"
                />
              </div>

              <div className="mt-6 border-t border-b py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Subtotal</p>
                  <p className="font-semibold text-gray-900">
                    ${subtotal.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Envio</p>
                  <strong className="font-semibold text-gray-900">
                    Gratis
                  </strong>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${total.toLocaleString()}
                </p>
              </div>
            </div>
            <div onClick={handleSubmit}>
              <MPButton handleSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </MPProvider>
  );
};

export default Payment;
