import React, { useState, useEffect } from "react";
import { useAreaData } from "../../hook/areaData.js";
import AreaRow from "../../components/area/AreaTableRow.jsx";
import ModalOpenArea from "../../components/area/ModalOpenArea.jsx";
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

const TABLE_HEAD = [
  "Area Name",
  "Status",
  "Created", 
  "Action",
];

const sortKeyMap = {
  Name: "name",
  Status: "isLive",
  Created: "createdAt",
};

function AreaTable() {
  const areas = useAreaData();
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
    cityId: [],
  });
  const [editingId, setEditingId] = useState(null);

  const rowsPerPage = 6;

  useEffect(() => {
    if (areas) {
      setTableRows(areas);
    }
  }, [areas]);

  const filteredRows = tableRows.filter((area) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      area.name.toLowerCase().includes(searchLower) ||
      area.cityId.some((city) =>
        city.name.toLowerCase().includes(searchLower)
      )
    );
  });

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

  const handleSort = (column) => {
    const key = sortKeyMap[column];
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const handleOpenModal = (area = null) => {
    if (area) {
      setFormData({
        name: area.name,
        isLive: area.isLive,
        cityId: area.cityId,
      });
      setEditingId(area._id);
    } else {
      setFormData({
        name: "",
        isLive: true,
        cityId: [],
      });
      setEditingId(null);
    }

    setIsModalOpen(true);
  };

  const handleSaveArea = () => {
    if (editingId) {
      setTableRows(
        tableRows.map((area) =>
          area._id === editingId ? { ...area, ...formData } : area
        )
      );
    } else {
      const newArea = {
        ...formData,
        _id: `temp-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      setTableRows([...tableRows, newArea]);
    }

    setIsModalOpen(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <Card className="h-full w-full shadow-md">
        <CardHeader floated={false} className="border-b p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <div>
              <Typography variant="h5">Area List</Typography>
              <Typography color="gray" className="mt-1 text-sm">
                Manage and view area information
              </Typography>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex items-center gap-2 bg-blue-600 text-white"
                size="sm"
                onClick={() => handleOpenModal()}
              >
                <UserPlusIcon className="h-4 w-4" /> Add Area
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
              {currentRows.map((area) => (
                <AreaRow
                  key={area._id}
                  area={area}
                  onEdit={() => handleOpenModal(area)}
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

      <ModalOpenArea
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        handleSave={handleSaveArea}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editingId}
      />
    </>
  );
}

export default AreaTable;
