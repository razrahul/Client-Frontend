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

const TABLE_ROWS = [
  {
    id: 1,
    name: "John Michael-1",
    email: "john@creative-tim.com",
    job: "Manager",
    org: "Organization",
    online: true,
    date: "23/04/18",
  },
  {
    id: 2,
    name: "Alexa Liras-2",
    email: "alexa@creative-tim.com",
    job: "Programmer",
    org: "Developer",
    online: false,
    date: "23/04/18",
  },
];

function AreaTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    job: "",
    org: "",
  });

  const filteredRows = TABLE_ROWS.filter(
    (row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.org.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
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

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditMember(member);
      setNewMember(member);
    } else {
      setEditMember(null);
      setNewMember({ name: "", email: "", job: "", org: "" });
    }
    setIsModalOpen(true);
  };

  const handleSaveMember = () => {
    if (editMember) {
      // Edit member logic (update existing member)
    } else {
      // Add new member logic
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className="h-full w-full shadow-md">
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
                icon={<MagnifyingGlassIcon className="h-5 w-5 flex items-center" />}
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
                        <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.map(
                ({ id, name, email, job, org, online, date }, index) => {
                  const isLast = index === currentRows.length - 1;
                  const rowClass = isLast ? "p-3" : "p-3 border-b";

                  return (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className={rowClass}>
                        <div className="flex flex-col">
                          <Typography variant="small" className="font-medium text-gray-800">
                            {name}
                          </Typography>
                          <Typography variant="small" className="text-gray-600">
                            {email}
                          </Typography>
                        </div>
                      </td>
                      <td className={rowClass}>
                        <div className="flex flex-col">
                          <Typography variant="small" className="font-medium text-gray-800">
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
                            onClick={() =>
                              handleOpenModal({ id, name, email, job, org, online, date })
                            }
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

      {/* Modal for Add/Edit Member */}
      <Dialog open={isModalOpen} handler={handleCloseModal} className="fixed inset-0 flex items-center justify-center z-50">
  <DialogHeader className="text-center text-xl font-semibold text-gray-900">
    {editMember ? "Edit Member" : "Add Member"}
  </DialogHeader>

  <DialogBody className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
    {/* Form Content */}
    <div className="space-y-4">
      <div>
        <Typography variant="small">Name</Typography>
        <Input
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          className="mt-2"
          size="lg"
        />
      </div>

      <div>
        <Typography variant="small">Email</Typography>
        <Input
          value={newMember.email}
          onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
          className="mt-2"
          size="lg"
        />
      </div>

      <div>
        <Typography variant="small">Job</Typography>
        <Input
          value={newMember.job}
          onChange={(e) => setNewMember({ ...newMember, job: e.target.value })}
          className="mt-2"
          size="lg"
        />
      </div>

      <div>
        <Typography variant="small">Organization</Typography>
        <Input
          value={newMember.org}
          onChange={(e) => setNewMember({ ...newMember, org: e.target.value })}
          className="mt-2"
          size="lg"
        />
      </div>
    </div>
  </DialogBody>

  {/* Modal Footer with Save and Cancel Buttons */}
  <DialogFooter className="flex flex-col sm:flex-row gap-4 sm:gap-2 justify-center sm:justify-between">
    <Button variant="outlined" color="gray" onClick={handleCloseModal} className="w-full sm:w-auto">
      Cancel
    </Button>
    <Button
      variant="filled"
      color="blue"
      onClick={handleSaveMember}
      className="w-full sm:w-auto"
    >
      Save
    </Button>
  </DialogFooter>
</Dialog>

    </>
  );
}

export default AreaTable;
