import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

const TABS = [
  { label: "All", value: "all" },
  { label: "Monitored", value: "monitored" },
  { label: "Unmonitored", value: "unmonitored" },
];

const TABLE_HEAD = ["Member", "Function", "Status", "Employed", ""];

//import TABLE_ROWS from "./data.js";
import { TABLE_ROWS as initialTableRows } from './data.js';

function AreaTable() {
  //
  const [tableRows, setTableRows] = useState(initialTableRows);
  //
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const [editMember, setEditMember] = useState(null); // To store member data for editing
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    job: "",
    org: "",
  });

  // Search filter
  const filteredRows = tableRows.filter(
    (row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.org.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting function
  const sortedRows = [...filteredRows].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Paginate rows based on current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedRows.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const handleSort = (column) => {
    const direction = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: column, direction });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Add model logic
  const handleOpenModal = (member = null) => {
    if (member) {
      setEditMember(member); // Set member data for editing
      setNewMember(member); // Fill fields with current data for editing
    } else {
      setEditMember(null); // New member, no editing
      setNewMember({ name: "", email: "", job: "", org: "", online: false, date: "aajtak" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveMember = () => {
    if (editMember) {
      const updatedMembers = tableRows.map((member) =>
        member.id === editMember.id ? { ...member, ...newMember } : member
      );
      setTableRows (updatedMembers);

      console.log("Member updated:", newMember);
    } else {
      const newMemberWithId = { ...newMember, id: generateUniqueId() }; // assuming you want to generate a unique ID
      //setTableRows.push(newMemberWithId);
      setTableRows([...tableRows, newMemberWithId]); 

      console.log("New member added:", newMemberWithId);
    }

    setIsModalOpen(false);
  };

  const generateUniqueId = () => {
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  return (
    <>
      <Card className="h-full w-full shadow-md">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none border-b p-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <div>
              <Typography variant="h5" color="blue-gray">
                Members List
              </Typography>
              <Typography color="gray" className="mt-1 text-sm">
                See information about all members
              </Typography>
            </div>
            <div className="flex gap-2">
              <Button variant="outlined" size="sm">
                View All
              </Button>
              <Button
                className="flex items-center gap-2 bg-blue-600 text-white"
                size="sm"
                onClick={() => handleOpenModal()}
              >
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Member
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <Tabs value="all" className="w-full md:w-auto">
              <TabsHeader>
                {TABS.map(({ label, value }) => (
                  <Tab key={value} value={value}>
                    {label}
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
            <div className="w-full md:w-72 flex items-center gap-2">
              <Input
                icon={
                  <MagnifyingGlassIcon className="h-5 w-5 flex items-center" />
                }
                placeholder="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto p-4">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="p-3 border-b cursor-pointer"
                    onClick={() => handleSort(head.toLowerCase())}
                  >
                    <Typography
                      variant="small"
                      className="flex items-center gap-2 font-medium text-gray-700"
                    >
                      {head}{" "}
                      {index !== TABLE_HEAD.length - 1 && (
                        <ChevronUpDownIcon
                          strokeWidth={2}
                          className="h-4 w-4"
                        />
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.map(
                ({ name, email, job, org, online, date,id }, index) => {
                  const isLast = index === currentRows.length - 1;
                  const rowClass = isLast ? "p-3" : "p-3 border-b";

                  return (
                    <tr key={name} className="hover:bg-gray-50">
                      <td className={rowClass}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            className="font-medium text-gray-800"
                          >
                            {name}
                          </Typography>
                          <Typography variant="small" className="text-gray-600">
                            {email}
                          </Typography>
                        </div>
                      </td>
                      <td className={rowClass}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            className="font-medium text-gray-800"
                          >
                            {job}
                          </Typography>
                          <Typography variant="small" className="text-gray-600">
                            {org}
                          </Typography>
                        </div>
                      </td>
                      <td className={rowClass}>
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={online ? "Online" : "Offline"}
                          color={online ? "green" : "blue-gray"}
                        />
                      </td>
                      <td className={rowClass}>
                        <Typography variant="small" className="text-gray-800">
                          {date}
                        </Typography>
                      </td>
                      <td className={rowClass}>
                        <Tooltip content="Edit User">
                          <IconButton
                            variant="text"
                            onClick={() => {
                              handleOpenModal({
                                id,
                                name,
                                email,
                                job,
                                org,
                                online,
                                date
                              });
                            }}
                          >
                            <PencilIcon className="h-4 w-4 text-gray-600" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <Typography variant="small" className="text-gray-700">
            Page {currentPage} of {totalPages}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      {/* //model for add/edit member
      <Card className="h-full w-12 shadow-md flex items-center justify-center">
        //Modal for Add/Edit Member 
        <Dialog
          open={isModalOpen}
          handler={handleCloseModal}
          className="  bg-red-500 card fixed inset-0 flex flex-col items-center justify-center z-50"
        >
          <DialogHeader className="text-center">
            {editMember ? "Edit Member" : "Add Member"}
          </DialogHeader>
          <DialogBody className="p-4 bg-white rounded-md shadow-md w-96">
            <div className="space-y-4">
              <div>
                <Typography variant="small">Name</Typography>
                <Input
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Typography variant="small">Email</Typography>
                <Input
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Typography variant="small">Job</Typography>
                <Input
                  value={newMember.job}
                  onChange={(e) =>
                    setNewMember({ ...newMember, job: e.target.value })
                  }
                />
              </div>
              <div>
                <Typography variant="small">Organization</Typography>
                <Input
                  value={newMember.org}
                  onChange={(e) =>
                    setNewMember({ ...newMember, org: e.target.value })
                  }
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="flex justify-between">
            <Button variant="outlined" color="gray" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="filled" color="blue" onClick={handleSaveMember}>
              Save
            </Button>
          </DialogFooter>
        </Dialog>
      </Card>*/}
      //modified by parminder(belowcode)
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Modal content */}
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <DialogHeader className="text-center">
              {editMember ? "Edit Member" : "Add Member"}
            </DialogHeader>

            <DialogBody className="p-4">
              <div className="space-y-4">
                <div>
                  <Typography variant="small">Name</Typography>
                  <Input
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember({ ...newMember, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <Typography variant="small">Email</Typography>
                  <Input
                    value={newMember.email}
                    onChange={(e) =>
                      setNewMember({ ...newMember, email: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <Typography variant="small">Job</Typography>
                  <Input
                    value={newMember.job}
                    onChange={(e) =>
                      setNewMember({ ...newMember, job: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <Typography variant="small">Organization</Typography>
                  <Input
                    value={newMember.org}
                    onChange={(e) =>
                      setNewMember({ ...newMember, org: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </DialogBody>

            <DialogFooter className="flex justify-between mt-4">
              <Button
                variant="filled"
                className="bg-blue-600  text-white p-2 rounded"
                onClick={handleSaveMember}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                className="bg-gray-600  text-white p-2 rounded"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
            </DialogFooter>
          </div>
        </div>
      )}
    </>
  );
}

export default AreaTable;
