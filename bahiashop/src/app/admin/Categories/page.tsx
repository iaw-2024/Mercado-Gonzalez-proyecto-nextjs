"use client";

import MaxWidthWrapper from "@/components/layouts/MaxWidthWrapper";
import { useGlobalContext, Category } from "@/context/StoreProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { isAdmin } from "@/lib/utils";
import NotFound from "@/app/not-found";

const AdminCategoriesPanel = () => {
  const {
    setSearch,
    categories,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useGlobalContext();
  const [addCategoriesModal, setAddCategoriesModal] = useState(false);
  const [editCategoriesModal, setEditCategoriesModal] = useState(false);
  const [deleteCategoriesModal, setDeleteCategoriesModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const router = useRouter();
  const { data: session } = useSession();
  const [admin, setAdmin] = useState<boolean>(false);

  useEffect(() => {
    setSearch("");
    getCategories();
    setAdmin(session ? isAdmin(session) : false);
  }, []);

  if (!admin) {
    return <NotFound />;
  }

  const filteredCategories = categories.filter((category) =>
    category.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const navigateToAdmin = () => {
    router.push("/admin");
  };

  const handleAddCategory = async () => {
    await createCategory(categoryName);
    setAddCategoriesModal(false);
    setCategoryName("");
    toast.success(`Se creó la categoría ${categoryName} exitosamente!`, {
      position: "top-right",
      style: {
        width: "300px",
        fontSize: "1rem",
      },
    });
  };

  const handleEditCategory = async () => {
    if (selectedCategory) {
      await updateCategory(selectedCategory.id, categoryName);
      setEditCategoriesModal(false);
      setCategoryName("");
      setSelectedCategory(null);
      toast.success(`Se editó la categoría exitosamente!`, {
        position: "top-right",
        style: {
          width: "300px",
          fontSize: "1rem",
        },
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      await deleteCategory(selectedCategory.id);
      setDeleteCategoriesModal(false);
      setSelectedCategory(null);
      toast.success(`Se eliminó la categoría exitosamente!`, {
        position: "top-right",
        style: {
          width: "300px",
          fontSize: "1rem",
        },
      });
    }
  };

  return (
    <MaxWidthWrapper>
      <ToastContainer />
      <section className="dark:bg-gray-900 p-4 sm:p-5 antialiased">
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-12">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
              <div className="relative w-full md:w-1/2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.817A6 6 0 012 8z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Buscar Categoría"
                  className="w-full p-2 pl-10 border border-gray-300 rounded"
                />
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setAddCategoriesModal(true)}
                  className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                >
                  <svg
                    className="h-3.5 w-3.5 mr-1.5 -ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    />
                  </svg>
                  Agregar Categoría
                </button>
                <button
                  type="button"
                  onClick={navigateToAdmin}
                  className="flex items-center justify-center text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Panel Principal
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="p-4">
                      Categoría
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="flex items-center mr-3">
                          {category.nombre}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end space-x-3">
                          {category.nombre !== "Sin categoria" && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setEditCategoriesModal(true);
                                }}
                                className="flex items-center justify-center text-green-600 bg-green-100 hover:bg-green-200 focus:ring-4 focus:ring-green-300 border border-green-300 rounded-lg text-sm font-medium px-4 py-2"
                              >
                                <FaEdit className="mr-2" />
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setDeleteCategoriesModal(true);
                                }}
                                className="flex items-center justify-center text-red-600 bg-red-100 hover:bg-red-200 focus:ring-4 focus:ring-red-300 border border-red-300 rounded-lg text-sm font-medium px-4 py-2"
                              >
                                <FaRegTrashAlt className="mr-2" />
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center p-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`mx-1 ${
                    currentPage === index + 1
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200 text-blue-400"
                  }`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Modal
        show={addCategoriesModal}
        onClose={() => setAddCategoriesModal(false)}
      >
        <Modal.Header>Agregar Categoria</Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nombre de la categoria"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddCategory}>Agregar</Button>
          <Button onClick={() => setAddCategoriesModal(false)} color="gray">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={editCategoriesModal}
        onClose={() => setEditCategoriesModal(false)}
      >
        <Modal.Header>Editar Categoria</Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={
              categoryName || (selectedCategory ? selectedCategory.nombre : "")
            }
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nombre de la categoria"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleEditCategory}>Editar</Button>
          <Button onClick={() => setEditCategoriesModal(false)} color="gray">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={deleteCategoriesModal}
        size="md"
        onClose={() => setDeleteCategoriesModal(false)}
        popup
      >
        <Modal.Header>Eliminar Categoria</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Está seguro que desea eliminar esta categoria?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteCategory}>
                {"Si, Estoy seguro"}
              </Button>
              <Button
                color="gray"
                onClick={() => setDeleteCategoriesModal(false)}
              >
                No, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </MaxWidthWrapper>
  );
};

export default AdminCategoriesPanel;
