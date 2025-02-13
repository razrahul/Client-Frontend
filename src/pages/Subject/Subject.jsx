import React, { useState, useEffect } from "react";
import { useSubjectData } from "../../hook/subjectData.js";
import SubjectRow from "../../components/subject/SubjectTableRow.jsx";
import ModalOpenSubject from "../../components/subject/ModalOpenSubject.jsx";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { PencilIcon, ToggleLeft, ToggleRight, TrashIcon } from "lucide-react";

const TABLE_HEAD = ["Name", "Status", "Action"];

const sortKeyMap = {
  Name: "name",
  Status: "isLive",
};

function SubjectTable() {
  const {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    toggleSubjectLiveStatus,
  } = useSubjectData();
  const [tableRows, setTableRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    isLive: true,
  });
  const [editingId, setEditingId] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State for confirmation modal
  const [subjectToDelete, setSubjectToDelete] = useState(null); // Store the subject ID to delete

  const filteredRows = tableRows.filter((subject) => {
    const searchLower = searchTerm.toLowerCase();
    return subject.name && subject.name.toLowerCase().includes(searchLower);
  });

  const rowsPerPage = import.meta.env.VITE_ROW_PER_PAGE;

  useEffect(() => {
    if (Array.isArray(subjects)) {
      setTableRows(subjects);
    }
  }, [subjects]);

  // Sorting logic
  const sortedRows = [...filteredRows].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === "createdAt") {
      return sortConfig.direction === "asc"
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    }

    if (typeof aValue === "boolean" && typeof bValue === "boolean") {
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

  // Sorting handler
  const handleSort = (column) => {
    const key = sortKeyMap[column];
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const handleOpenModal = (subject = null) => {
    if (subject) {
      setFormData({
        name: subject.name,
        isLive: subject.isLive,
      });
      setEditingId(subject._id);
    } else {
      setFormData({
        name: "",
        isLive: true,
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSaveSubject = () => {
    const updatedSubject = {
      name: formData.name,
      isLive: formData.isLive,
      _id: editingId,
    };

    if (editingId) {
      updateSubject(editingId, updatedSubject);
    } else {
      addSubject(updatedSubject);
    }

    setIsModalOpen(false);
  };

  // Handle delete confirmation modal open
  const handleConfirmDelete = (subjectId) => {
    setSubjectToDelete(subjectId);
    setIsConfirmOpen(true);
  };

  // Delete subject
  const handleDeleteSubject = () => {
    if (subjectToDelete) {
      deleteSubject(subjectToDelete);
      setTableRows((prevRows) =>
        prevRows.filter((subject) => subject._id !== subjectToDelete)
      );
    }
    setIsConfirmOpen(false);
  };

  // Handle cancel deletion
  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setSubjectToDelete(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleToggleLive = (id) => {
    toggleSubjectLiveStatus(id);
  };

  if (subjects.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card className="h-full w-full ">
        <CardHeader floated={false} className=" p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <div>
              <Typography variant="h5">Subject List</Typography>
              <Typography color="gray" className="mt-1 text-sm">
                Manage and view subject information
              </Typography>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex items-center gap-2 bg-blue-600 text-white"
                size="sm"
                onClick={() => handleOpenModal()}
              >
                <UserPlusIcon className="h-4 w-4" /> Add Subject
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
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="p-3 cursor-pointer"
                    onClick={() => handleSort(head)}
                  >
                    <div className="flex items-center gap-1">
                      {head}
                      <ChevronUpDownIcon className="h-4 w-4" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.map((subject) => (
                <tr key={subject._id} className="hover:bg-gray-50">
                  <td className="p-3 text-left">
                    <strong>{subject.name || "No name provided"}</strong>
                  </td>

                  <td className="p-3 text-left">
                    <strong>{subject.isLive ? "Active" : "Inactive"}</strong>

                    {/* Toggle Icon */}
                    <span
                      onClick={() => handleToggleLive(subject._id)}
                      style={{ cursor: "pointer" }}
                    >
                      {subject.isLive ? (
                        <ToggleRight className="text-blue-600" />
                      ) : (
                        <ToggleLeft className="text-black" />
                      )}
                    </span>
                  </td>

                  <td className="p-3  flex gap-2 text-decoration-line: none;">
                    <Button
                      className="flex items-center gap-2 text-black hover:bg-blue-600 hover:text-white"
                      size="sm"
                      onClick={() => handleOpenModal(subject)}
                    >
                      <PencilIcon className="h-5 w-5 " />
                    </Button>

                    <Button
                      className="flex items-center gap-2 text-red-600 hover:bg-red-600 hover:text-white"
                      size="sm"
                      onClick={() => handleConfirmDelete(subject._id)} // Open confirmation modal
                    >
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      <ModalOpenSubject
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        handleSave={handleSaveSubject}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingId}
      />

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur confirm-dialog ">
          <div className="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
            <div className=" opacity-25 w-full h-full absolute z-10 inset-0"></div>
            <div className="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative shadow-lg">
              <div className="md:flex items-center">
                <div className="rounded-full border border-gray-300 flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
                  <i className="bx bx-error text-3xl">&#9888;</i>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                  <p className="font-bold">Warning!</p>
                  <p className="text-sm text-gray-700 mt-1">
                    You will lose all of your data by deleting this. This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="text-center md:text-right mt-4 md:flex md:justify-end">
                <button
                  className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2"
                  onClick={handleDeleteSubject} // Delete the subject
                >
                  Delete
                </button>
                <button
                  className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 md:mt-0 md:order-1"
                  onClick={handleCancelDelete} // Close the confirmation dialog
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

export default SubjectTable;
