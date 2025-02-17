import React, { useState, useEffect } from "react";
import ModalOpenStudent from "../../components/student/ModalOpenStudent"; // Assuming similar modal for Student
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
import { PencilIcon, TrashIcon } from "lucide-react";
import { useStudentData } from "../../hook/studentData.js"; // Assuming a similar hook for Student
import {
  getAllStudents,
  deleteStudentById,
} from "../../redux/actions/studentAction.js"; // Assuming a similar action for Student
import { useDispatch, useSelector } from "react-redux";

const TABLE_HEAD = [
  "Name",
  "Email",
  "Phone",
  "About Us",
  "Class Name", // Added column for class name
  "Gender", // Added column for gender
  "Area",
  "Subject",
  "Charge Rate",
  "Image",
  "Action",
];

const sortKeyMap = {
  Name: "name",
  Gender: "gender",
  ClassName: "className", // Added to map for sorting
  Subjects: "subject",
  Location: "city.name",
  Rate: "chargeRate",
  Joined: "createdAt",
};

function StudentTable() {
  const [tableRows, setTableRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [data, SetData] = useState(""); // Store data for editing

  const rowsPerPage = 6;
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(getAllStudents());
  }, [dispatch]);

  useEffect(() => {
    if (students && Array.isArray(students)) {
      setTableRows(students);
    }
  }, [students]);

  const filteredRows = tableRows.filter((student) => {
    return (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.gender.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    const getNestedValue = (obj, key) =>
      key.split(".").reduce((o, k) => (o || {})[k], obj);
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
    const key = sortKeyMap[column];
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      SetData(student);
      setEditingId(student._id);
    } else {
      SetData("");
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSaveStudent = () => {
    setIsModalOpen(false);
  };

  // delete student function
  const handleDeleteStudent = (id) => {
    console.log("Delete Student", id);
    dispatch(deleteStudentById(id)).then(() => {
      dispatch(getAllStudents()); // Re-fetch students after deletion
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <div>
              <Typography variant="h5">Student List</Typography>
              <Typography color="gray" className="mt-1 text-sm">
                Manage and view student information
              </Typography>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex items-center gap-2 bg-blue-600 text-white"
                size="sm"
                onClick={() => handleOpenModal()}
              >
                <UserPlusIcon className="h-4 w-4" /> Add Student
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
            <div>No students available.</div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="p-3 cursor-pointer text-left text-sm font-medium"
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
                {currentRows.length > 0 ? (
                  currentRows.map((student) => (
                    <tr key={student._id}>
                      <td className="text-sm py-2 pl-2">{student.name}</td>
                      <td className="text-sm py-2 pl-2">{student.email}</td>
                      <td className="text-sm py-2 pl-2">{student.phone}</td>
                      <td className="text-sm py-2 pl-2">
                        {student.aboutUs || "No about us available"}
                      </td>
                      <td className="text-sm py-2 pl-2">
                        {student.class || "Unknown"}
                      </td>
                      {/* Class Name column */}
                      <td className="text-sm py-2 pl-2">
                        {student.gender || "Unknown"}
                      </td>
                      {/* Gender column */}
                      <td className="text-sm py-2 pl-2">
                        {student.area?.name || "Unknown"}
                      </td>
                      <td className="text-sm py-2 pl-2">
                        {student.subject?.length > 0
                          ? student.subject.map((sub) => sub.name).join(", ")
                          : "No subjects"}
                      </td>
                      <td className="text-sm py-2 pl-2">
                        {student.chargeRate}
                      </td>
                      <td>
                        <img
                          src={student.image?.url || "default.jpg"}
                          alt={student.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </td>
                      <td className="p-3 border-b flex gap-2 text-decoration-line: none;">
                        <Button
                          className="flex items-center gap-2 text-black hover:bg-blue-600 hover:text-white"
                          onClick={() => handleOpenModal(student)}
                          color="blue"
                          size="sm"
                        >
                          <PencilIcon className="h-5 w-5 " />
                        </Button>

                        <Button
                          className="flex items-center gap-2 text-red-600 hover:bg-red-600 hover:text-white"
                          onClick={() => handleDeleteStudent(student._id)}
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
                    <td colSpan="11">No students available</td>
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

      <ModalOpenStudent
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        handleSave={handleSaveStudent}
        data={data}
        isEditing={!!editingId}
      />
    </>
  );
}

export default StudentTable;
