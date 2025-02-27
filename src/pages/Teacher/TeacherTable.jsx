import React, { useState, useEffect } from "react";
import ModalOpenTeacher from "../../components/teacher/ModalOpenTeacher";
import {
  Button,
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { PencilIcon, ToggleLeft, ToggleRight, TrashIcon } from "lucide-react";
import {
  getAllTeachers,
  deleteTeacher,
  updateTeacherLiveStatusById,
} from "../../redux/actions/teacherAction.js";
import { useDispatch, useSelector } from "react-redux";

const TABLE_HEAD = [
  "Name/Email",
  "Phone",
  "About Us",
  "Area",
  "Subject",
  "Charge Rate",
  "Status",
  "Image",
  "Action",
];

const sortKeyMap = {
  Name: "name",
  Email: "email",
  Phone: "phone",
  Status: "isLive",
  Area: "area.name",
};

function TeacherTable() {
  const [tableRows, setTableRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [data, SetData] = useState("");

  const rowsPerPage = 6;

  const dispatch = useDispatch();
  const { teachers } = useSelector((state) => state.teacher);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [teacherToDelete, setteacherToDelete] = useState(null);

  useEffect(() => {
    dispatch(getAllTeachers());
  }, [dispatch]);

  useEffect(() => {
    if (teachers && Array.isArray(teachers)) {
      setTableRows(teachers);
    }
  }, [teachers]);

  const filteredRows = tableRows.filter((teacher) => {
    return (
      teacher.name &&
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    const getNestedValue = (obj, key) => {
      if (!obj || !key) return undefined;

      return key.split(".").reduce((o, k) => {
        if (o && o[k] !== undefined) {
          return o[k];
        }
        return undefined;
      }, obj);
    };

    const aValue = getNestedValue(a, sortConfig.key);
    const bValue = getNestedValue(b, sortConfig.key);

    if (sortConfig.key === "createdAt") {
      return sortConfig.direction === "asc"
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return sortConfig.direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedRows.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const handleSort = (column) => {
    if (column === "Name/Email") {
      const direction =
        sortConfig.key === "name" && sortConfig.direction === "asc"
          ? "desc"
          : "asc";
      setSortConfig({ key: "name", direction });
    } else {
      const key = sortKeyMap[column];
      const direction =
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc";
      setSortConfig({ key, direction });
    }
  };

  const handleOpenModal = (teacher = null) => {
    if (teacher) {
      SetData(teacher);
      setEditingId(teacher._id);
    } else {
      SetData("");
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSaveTeacher = () => {
    setIsModalOpen(false);
  };

  const handleDeleteTeacher = (id) => {
    dispatch(deleteTeacher(id)).then(() => {
      dispatch(getAllTeachers());
    });
    setIsConfirmationOpen(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openConfirmationDialog = (id) => {
    setteacherToDelete(id);
    setIsConfirmationOpen(true);
  };

  const closeConfirmationDialog = () => {
    setteacherToDelete(null);
    setIsConfirmationOpen(false);
  };

  const handleToggleLiveStatus = (id) => {
    dispatch(updateTeacherLiveStatusById(id));
  };

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <div>
              <Typography variant="h5">Teacher List</Typography>
              <Typography color="gray" className="mt-1 text-sm">
                Manage and view teacher information
              </Typography>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex items-center gap-2 bg-blue-600 text-white"
                size="sm"
                onClick={() => handleOpenModal()}
              >
                <UserPlusIcon className="h-4 w-4" /> Add Teacher
              </Button>
            </div>
          </div>
          <div className="relative mt-4 w-full md:w-72">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
        </CardHeader>

        <CardBody className="p-4">
          {tableRows.length === 0 ? (
            <div>No teachers available.</div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className={`p-3 text-left text-sm font-medium 
                      ${
                        head !== "Subject" &&
                        head !== "Charge Rate" &&
                        head !== "Image" &&
                        head !== "Action" &&
                        head !== "About Us" &&
                        head !== "Area"
                          ? "cursor-pointer hover:bg-gray-200"
                          : "cursor-default"
                      }`}
                      onClick={
                        head === "Name/Email"
                          ? () => handleSort("Name/Email")
                          : () => handleSort(head)
                      }
                    >
                      <div className="flex items-center gap-1">
                        {head}
                        {head !== "Subject" &&
                          head !== "Charge Rate" &&
                          head !== "Image" &&
                          head !== "Action" &&
                          head !== "About Us" &&
                          head !== "Area" && (
                            <ChevronUpDownIcon className="h-4 w-4" />
                          )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentRows.length > 0 ? (
                  currentRows.map((teacher) => (
                    <tr key={teacher._id}>
                      <td className="text-sm py-2 pl-2">
                        <strong>{teacher.name}</strong>
                        <br />
                        {teacher.email}
                      </td>
                      <td className="text-sm py-2 pl-2">{teacher.phone}</td>
                      <td className="text-sm py-2 pl-2">
                        {teacher.aboutUs || "No about us available"}
                      </td>
                      <td className="text-sm py-2 pl-2">
                        {teacher.area?.name || "Unknown"}
                      </td>
                      <td className="text-sm py-2 pl-2">
                        {teacher.subject?.length > 0
                          ? teacher.subject.map((sub) => sub.name).join(", ")
                          : "No subjects"}
                      </td>
                      <td className="text-sm py-2 pl-2">
                        {teacher.chargeRate}
                      </td>

                      <td className="p-3 text-left">
                        <strong>
                          {teacher.isLive ? "Active" : "Inactive"}
                        </strong>
                        <span
                          onClick={() => handleToggleLiveStatus(teacher._id)}
                        >
                          {teacher.isLive ? (
                            <ToggleRight className="text-blue-600 cursor-pointer" />
                          ) : (
                            <ToggleLeft className="text-black cursor-pointer" />
                          )}
                        </span>
                      </td>

                      <td>
                        <img
                          src={teacher.image?.url || "default.jpg"}
                          alt={teacher.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </td>
                      <td className="p-3  flex gap-2 text-decoration-line: none;">
                        <Button
                          className="flex items-center gap-2 text-black bg-white hover:bg-blue-600 hover:text-white"
                          onClick={() => handleOpenModal(teacher)}
                          color="blue"
                          size="sm"
                        >
                          <PencilIcon className="h-5 w-5 " />
                        </Button>

                        <Button
                          className="flex items-center gap-2 text-red-600 bg-white hover:bg-red-600 hover:text-white"
                          onClick={() => openConfirmationDialog(teacher._id)}
                          color="blue"
                          size="sm"
                        >
                          <TrashIcon className="h-5 w-5 " />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No teachers available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardBody>

        <CardFooter className="flex items-center justify-between border-t p-4">
          <Typography variant="small">
            Page {currentPage} of {totalPages}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      <ModalOpenTeacher
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        handleSave={handleSaveTeacher}
        data={data}
        isEditing={!!editingId}
      />

      {isConfirmationOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur confirm-dialog ">
          <div className="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
            <div className=" opacity-25 w-full h-full absolute z-10 inset-0"></div>
            <div className="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative ">
              <div className="md:flex items-center">
                <div className="rounded-full border border-gray-300 flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
                  <i className="bx bx-error text-3xl">&#9888;</i>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                  <p className="font-bold">Warning!</p>
                  <p className="text-sm text-gray-700 mt-1">
                    You will lose all of your data by deleting this. This action
                    cannot be undone.
                  </p>
                </div>
              </div>
              <div className="text-center md:text-right mt-4 md:flex md:justify-end">
                <button
                  className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2"
                  onClick={() => {
                    handleDeleteTeacher(teacherToDelete);
                  }}
                >
                  Delete
                </button>
                <button
                  className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 md:mt-0 md:order-1"
                  onClick={closeConfirmationDialog}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TeacherTable;
