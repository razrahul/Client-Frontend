import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux"; // No longer needed
import { useSubjectData } from "../../hook/subjectData.js"; // Import the custom hook
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

const TABLE_HEAD = ["Name", "Is Live", "Action"];

function SubjectTable() {
  const { subjects, addSubject, updateSubject } = useSubjectData(); // Get subjects and functions from the hook
  const [tableRows, setTableRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    isLive: true,
  });
  const [editingId, setEditingId] = useState(null);

  const filteredRows = tableRows.filter((subject) => {
    const searchLower = searchTerm.toLowerCase();
    return subject.name && subject.name.toLowerCase().includes(searchLower);
  });

  const rowsPerPage = 6;
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  // Slice filtered rows based on the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

  useEffect(() => {
    if (Array.isArray(subjects)) {
      setTableRows(subjects); // Update table rows with the subjects from the store
    }
  }, [subjects]);

  const handleOpenModal = (subject = null) => {
    if (subject) {
      setFormData({
        name: subject.name,
        isLive: subject.isLive,
      });
      setEditingId(subject._id); // Set the subject id for editing
    } else {
      setFormData({
        name: "",
        isLive: true,
      });
      setEditingId(null);
    }
    setIsModalOpen(true); // Open modal
  };
  
  const handleSaveSubject = () => {
    const updatedSubject = {
      name: formData.name,
      isLive: formData.isLive,
      _id: editingId,
    };
  
    if (editingId) {
      // Call the updateSubject function to update the subject
      updateSubject(editingId, updatedSubject);
    } else {
      // Call the addSubject function to add a new subject
      addSubject(updatedSubject);
    }
  
    setIsModalOpen(false); // Close modal after save
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (subjects.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card className="h-full w-full shadow-md">
        <CardHeader floated={false} className="border-b p-4">
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
                  <th key={head} className="p-3 cursor-pointer">
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
                <SubjectRow
                  key={subject._id}
                  subject={subject}
                  onEdit={() => handleOpenModal(subject)} // Open the modal to edit the subject
                />
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
    </>
  );
}

export default SubjectTable;
