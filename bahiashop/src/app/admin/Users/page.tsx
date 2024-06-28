"use client";

import MaxWidthWrapper from "@/components/layouts/MaxWidthWrapper";
import { User, useGlobalContext } from "@/context/StoreProvider";
import { useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle, HiSearch } from "react-icons/hi";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { isAdmin } from "@/lib/utils";
import NotFound from "@/app/not-found";

const AdminUserPanel = () => {
  const { users, getUsers, updateUser, deleteUser } = useGlobalContext();
  const [editUserModal, setEditUserModal] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const router = useRouter();
  const { data: session } = useSession();
  const [admin, setAdmin] = useState<boolean>(false);

  useEffect(() => {
    getUsers();
    setAdmin(session ? isAdmin(session) : false);
  }, []);

  if (!admin) {
    return <NotFound />;
  }

  const filteredUsers = users.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditUser = async () => {
    if (selectedUser) {
      await updateUser({ ...selectedUser, rol: userRole });
      setEditUserModal(false);
      setUserRole("");
      toast.success(
        `Se cambió el rol del usuario ${selectedUser.nombre} exitosamente!`,
        {
          position: "top-right",
          style: {
            width: "300px",
            fontSize: "1rem",
          },
        }
      );
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.user_id);
      setDeleteUserModal(false);
      setSelectedUser(null);
      await updateUser({ ...selectedUser, rol: userRole });
      setEditUserModal(false);
      setUserRole("");
      toast.success(
        `Se eliminó el usuario ${selectedUser.nombre} exitosamente!`,
        {
          position: "top-right",
          style: {
            width: "300px",
            fontSize: "1rem",
          },
        }
      );
    }
  };

  const navigateToAdmin = () => {
    router.push("/admin");
  };

  return (
    <MaxWidthWrapper>
      <ToastContainer />
      <section className="dark:bg-gray-900 p-4 sm:p-5 antialiased">
        <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
          <div className="w-full md:w-1/2 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <HiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar Usuario"
              className="w-full p-2 pl-10 border border-gray-300 rounded"
            />
          </div>
          <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center justify-end md:space-x-3 space-y-2 md:space-y-0 flex-shrink-0">
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
                  Nombre
                </th>
                <th scope="col" className="p-4">
                  Apellido
                </th>
                <th scope="col" className="p-4">
                  Email
                </th>
                <th scope="col" className="p-4">
                  Rol
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.user_id}
                  className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.nombre}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.apellido}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.rol}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end space-x-3">
                      {user.nombre !== "admin" ||
                      user.apellido !== "admin" ||
                      user.email !== "admin@admin.com" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(user);
                              setUserRole(user.rol);
                              setEditUserModal(true);
                            }}
                            className="flex items-center justify-center text-green-600 bg-green-100 hover:bg-green-200 focus:ring-4 focus:ring-green-300 border border-green-300 rounded-lg text-sm font-medium px-4 py-2"
                          >
                            <FaEdit className="mr-2" />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteUserModal(true);
                            }}
                            className="flex items-center justify-center text-red-600 bg-red-100 hover:bg-red-200 focus:ring-4 focus:ring-red-300 border border-red-300 rounded-lg text-sm font-medium px-4 py-2"
                          >
                            <FaRegTrashAlt className="mr-2" />
                            Eliminar
                          </button>
                        </>
                      ) : null}
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
                  ? "bg-primary-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </section>

      <Modal show={editUserModal} onClose={() => setEditUserModal(false)}>
        <Modal.Header>Editar Usuario</Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-4">
              <label
                htmlFor="user-role"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Rol
              </label>
              <select
                id="user-role"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
              >
                <option value="" disabled>
                  Seleccione Rol
                </option>
                <option value="Admin">Admin</option>
                <option value="Cliente">Cliente</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleEditUser}>Editar Usuario</Button>
          <Button onClick={() => setEditUserModal(false)} color="gray">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={deleteUserModal} onClose={() => setDeleteUserModal(false)}>
        <Modal.Header>Eliminar Usuario</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Está seguro que desea eliminar este usuario?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                {"Sí, Estoy Seguro"}
              </Button>
              <Button color="gray" onClick={() => setDeleteUserModal(false)}>
                No, Cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </MaxWidthWrapper>
  );
};

export default AdminUserPanel;
