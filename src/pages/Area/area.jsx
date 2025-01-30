import React, { useState } from "react";
import { MagnifyingGlassIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
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
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton
} from "@material-tailwind/react";

const TABS = [
  { label: "All", value: "all" },
  { label: "Monitored", value: "monitored" },
  { label: "Unmonitored", value: "unmonitored" },
];

const TABLE_HEAD = ["Member", "Function", "Status", "Employed", ""];

const TABLE_ROWS = [
  { name: "John Michael-1", email: "john@creative-tim.com", job: "Manager", org: "Organization", online: true, date: "23/04/18" },
  { name: "Alice Johnson", email: "alice@example.com", job: "Developer", org: "Tech Inc.", online: false, date: "15/05/19" },
  // Add more rows as needed
];

function AreaTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const [editMember, setEditMember] = useState(null); // To store member data for editing
  const [newMember, setNewMember] = useState({ name: "", email: "", job: "", org: "" });

  const filteredRows = TABLE_ROWS.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.org.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedRows.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const handleSort = (column) => {
    const direction = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: column, direction });
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditMember(member); // Set member data for editing
      setNewMember(member); // Fill fields with current data for editing
    } else {
      setEditMember(null); // New member, no editing
      setNewMember({ name: "", email: "", job: "", org: "" });
    }
    setIsModalOpen(true);
  };

  const handleSaveMember = () => {
    if (editMember) {
      // Edit member logic (update existing member)
      // Replace editMember in TABLE_ROWS with newMember
    } else {
      // Add new member logic
      // Add newMember to TABLE_ROWS
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className="h-full w-full shadow-md">
        {/* Card Header with Title and Buttons */}
        <CardHeader floated={false} shadow={false} className="rounded-none border-b p-4">
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
        </CardHeader>

        {/* Search Bar */}
        <div className="p-4">
          <Input
            label="Search Members"
            icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Table Body */}
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
                    <Typography variant="small" className="flex items-center gap-2 font-medium text-gray-700">
                      {head}{" "}
                      {index !== TABLE_HEAD.length - 1 && (
                        <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.map(({ name, email, job, org, online, date }, index) => {
                const isLast = index === currentRows.length - 1;
                const rowClass = isLast ? "p-3" : "p-3 border-b";

                return (
                  <tr key={name} className="hover:bg-gray-50">
                    <td className={rowClass}>
                      <div className="flex flex-col">
                        <Typography variant="small" className="font-medium text-gray-800">
                          {name}
                        </Typography>
                        <Typography variant="small" className="text-gray-600">{email}</Typography>
                      </div>
                    </td>
                    <td className={rowClass}>
                      <div className="flex flex-col">
                        <Typography variant="small" className="font-medium text-gray-800">{job}</Typography>
                        <Typography variant="small" className="text-gray-600">{org}</Typography>
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
                      <Typography variant="small" className="text-gray-800">{date}</Typography>
                    </td>
                    <td className={rowClass}>
                      <Tooltip content="Edit User">
                        <IconButton variant="text" onClick={() => handleOpenModal({ name, email, job, org, online, date })}>
                          <PencilIcon className="h-4 w-4 text-gray-600" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>

        {/* Pagination */}
        <CardFooter className="flex items-center justify-between border-t p-4">
          {/* Pagination code */}
        </CardFooter>
      </Card>

      {/* Modal for Add/Edit Member */}
      <Dialog open={isModalOpen} handler={handleCloseModal}>
        <DialogHeader>{editMember ? "Edit Member" : "Add Member"}</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <div>
              <Typography variant="small">Name</Typography>
              <Input
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
            </div>
            <div>
              <Typography variant="small">Email</Typography>
              <Input
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              />
            </div>
            <div>
              <Typography variant="small">Job</Typography>
              <Input
                value={newMember.job}
                onChange={(e) => setNewMember({ ...newMember, job: e.target.value })}
              />
            </div>
            <div>
              <Typography variant="small">Organization</Typography>
              <Input
                value={newMember.org}
                onChange={(e) => setNewMember({ ...newMember, org: e.target.value })}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outlined" color="gray" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="filled" color="blue" onClick={handleSaveMember}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default AreaTable;
