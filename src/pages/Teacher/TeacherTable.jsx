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
import { useTeacherData } from "../../hook/teacherData";
import { getAllTeachers, deleteTeacher } from "../../redux/actions/teacherAction.js"
import { useDispatch, useSelector } from "react-redux";

const TABLE_HEAD = [
  "Name",
  "Email",
  "Phone",
  "About Us",
  "Area",
  "Subject",
  "Charge Rate",
  "Image",
  "Action",
];

const sortKeyMap = {
  Name: "name",
  Subjects: "subject",
  Status: "isLive",
  Location: "city.name",
  Rate: "chargeRate",
  Joined: "createdAt",
};

function TeacherTable() {
  // const { teachers, addTeacher, subjects, areas } = useTeacherData();
  const [tableRows, setTableRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState(null);

  const [data, SetData] = useState("")

  const rowsPerPage = 6;

  const dispatch = useDispatch();
  const {teachers} = useSelector((state) => state.teacher)

  useEffect(() => {
    dispatch(getAllTeachers());
   
  }, [dispatch])
  
 

  useEffect(() => {
    if (teachers && Array.isArray(teachers) && teachers.length > 0) {
      setTableRows((prevRows) => (prevRows.length === 0 ? teachers : prevRows));
    } 
  }, [teachers]);

  const filteredRows = tableRows.filter((teacher) => {
    const sub = teacher.subject;
    if (!sub || sub.length === 0) return false;
    const subjectString = Array.isArray(sub)
      ? sub.map((s) => s.name).join(" ")
      : sub;
    return (
      subjectString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  

  const handleOpenModal = (teacher = null) => {
    if (teacher) {
      SetData(teacher)
      setEditingId(teacher._id);
    } else {
      SetData("")
      setEditingId(null);
    }
    setIsModalOpen(true);
};



  const handleSaveTeacher = () => {
   
    // Close the modal
    setIsModalOpen(false);
  };


  //delete teacher faunction
  const handleDeleteTeacher = (id) =>{
    console.log("Delete Teacher", id)
    dispatch(deleteTeacher(id));
  }
  

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
                  currentRows.map((teacher) => (
                    <tr key={teacher._id}>
                      <td className="text-sm py-2 pl-2">{teacher.name}</td>
                      <td className="text-sm py-2 pl-2">{teacher.email}</td>
                      <td className="text-sm py-2 pl-2">{teacher.phone}</td>
                      <td className="text-sm py-2 pl-2">
                        {teacher.aboutUs || "No about us available"}
                      </td>
                      <td className="text-sm py-2 pl-2">{teacher.area?.name || "Unknown"}</td>
                      <td className="text-sm py-2 pl-2">
                        {teacher.subject?.length > 0
                          ? teacher.subject.map((sub) => sub.name).join(", ")
                          : "No subjects"}
                      </td>
                      <td className="text-sm py-2 pl-2">{teacher.chargeRate}</td>
                      <td>
                        <img
                          src={teacher.image?.url || "default.jpg"}
                          alt={teacher.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </td>
                      <td className="p-3 border-b flex gap-2 text-decoration-line: none;">
                        <Button
                          className="flex items-center gap-2 text-black hover:bg-blue-600 hover:text-white"
                          onClick={() => handleOpenModal(teacher)}
                          color="blue"
                          size="sm"
                        >
                          <PencilIcon className="h-5 w-5 " />
                        </Button>

                        <Button
                          className="flex items-center gap-2 text-red-600 hover:bg-red-600 hover:text-white"
                          onClick={() => handleDeleteTeacher(teacher._id)}
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
        // formData={formData}
        data={data}
        // setFormData={setFormData}
        isEditing={!!editingId}
      />
    </>
  );
}

export default TeacherTable;
