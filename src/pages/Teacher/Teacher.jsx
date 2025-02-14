import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Select, Option, Checkbox, Textarea } from "@material-tailwind/react";
import { MagnifyingGlassIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Typography, CardBody, CardFooter } from "@material-tailwind/react";

import { useTeacherData } from "../../hook/teacherData.js";

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
console.log(TeacherTable); // Check if the component is being correctly imported
  const { teachers, addTeacher, subjects, areas } = useTeacherData();
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
    subject: [],
    chargeRate: 0,
    city: { name: "" },
    isLive: true,
    aboutUs: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState(formData.subject);
  const [selectedArea, setSelectedArea] = useState(formData.city?.name || "");

  const rowsPerPage = 6;

  useEffect(() => {
    const teacherList = teachers.teachers || [];
    if (Array.isArray(teacherList) && teacherList.length > 0) {
      setTableRows(teacherList);
    }
  }, [teachers]);

  const filteredRows = tableRows.filter((teacher) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      teacher.name.toLowerCase().includes(searchLower) ||
      teacher.subject.toLowerCase().includes(searchLower) ||
      teacher.city.name.toLowerCase().includes(searchLower) ||
      (teacher.area?.name || "").toLowerCase().includes(searchLower)
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
      setFormData({
        name: teacher.name,
        subject: teacher.subject,
        chargeRate: teacher.chargeRate,
        city: teacher.city,
        isLive: teacher.isLive,
        aboutUs: teacher.aboutUs || "",
      });
      setEditingId(teacher._id);
    } else {
      setFormData({
        name: "",
        subject: [],
        chargeRate: 0,
        city: { name: "" },
        isLive: true,
        aboutUs: "",
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSaveTeacher = () => {
    if (editingId) {
      setTableRows(
        tableRows.map((teacher) =>
          teacher._id === editingId ? { ...teacher, ...formData } : teacher
        )
      );
    } else {
      const newTeacher = {
        ...formData,
        image: imageFile ? URL.createObjectURL(imageFile) : "",
      };
      addTeacher(newTeacher);
    }
    setIsModalOpen(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSubjectChange = (subjectId) => {
    setSelectedSubjects((prevSelected) =>
      prevSelected.includes(subjectId)
        ? prevSelected.filter((id) => id !== subjectId)
        : [...prevSelected, subjectId]
    );
    setFormData((prev) => ({ ...prev, subject: selectedSubjects }));
  };

  const handleAreaChange = (e) => {
    const selectedArea = e.target.value;
    setSelectedArea(selectedArea);
    setFormData((prev) => ({ ...prev, city: { name: selectedArea } }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.subject.length || !formData.city.name) {
      alert("Please fill all the fields.");
      return;
    }

    const newTeacher = {
      ...formData,
      image: imageFile ? URL.createObjectURL(imageFile) : "",
      chargeRate: formData.chargeRate || "100-200",
    };

    addTeacher(newTeacher);
    handleSaveTeacher(); // Close the modal after saving
  };

  return (
    <>
      <Card className="h-full w-full ">
        <CardHeader floated={false} className=" p-4">
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
              {currentRows.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.phone}</td>
                  <td>{teacher.aboutUs}</td>
                  <td>{teacher.city.name}</td>
                  <td>{teacher.subject.join(", ")}</td>
                  <td>{teacher.chargeRate}</td>
                  <td>
                    <img
                      src={teacher.image || "default.jpg"}
                      alt={teacher.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td>
                    <Button
                      onClick={() => handleOpenModal(teacher)}
                      color="blue"
                      size="sm"
                    >
                      Edit
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

      <Modal
        size="lg"
        active={isModalOpen}
        toggler={() => setIsModalOpen(false)}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {editingId ? "Edit Teacher" : "Add Teacher"}
            </h3>
            <Button
              variant="text"
              color="red"
              onClick={() => setIsModalOpen(false)}
            >
              X
            </Button>
          </div>
          <div className="space-y-4">
            <Input
              label="Teacher's Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subjects
              </label>
              <div className="space-y-2">
                {subjects.map((subject) => (
                  <Checkbox
                    key={subject._id}
                    label={subject.name}
                    checked={selectedSubjects.includes(subject._id)}
                    onChange={() => handleSubjectChange(subject._id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Area
              </label>
              <Select
                value={selectedArea}
                onChange={handleAreaChange}
                label="Select Area"
              >
                {areas.map((area) => (
                  <Option key={area._id} value={area.name}>
                    {area.name}
                  </Option>
                ))}
              </Select>
            </div>

            <Input
              label="Charge Rate"
              type="text"
              value={formData.chargeRate}
              onChange={(e) =>
                setFormData({ ...formData, chargeRate: e.target.value })
              }
            />

            <Textarea
              label="About Us"
              value={formData.aboutUs}
              onChange={(e) =>
                setFormData({ ...formData, aboutUs: e.target.value })
              }
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Image
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="p-2 border border-gray-300 rounded-md"
                />
                {imageFile && <span>{imageFile.name}</span>}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={handleSubmit} color="blue" size="lg">
                {editingId ? "Update Teacher" : "Add Teacher"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default TeacherTable;
