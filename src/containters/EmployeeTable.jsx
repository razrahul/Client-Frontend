import React, { useState } from 'react';

const EmployeeTable = () => {
  const [rows, setRows] = useState([
    { name: 'John Doe', department: 'Administration', phone: '(171) 555-2222' },
    { name: 'Peter Parker', department: 'Customer Service', phone: '(313) 555-5735' },
    { name: 'Fran Wilson', department: 'Human Resources', phone: '(503) 555-9931' },
    { name: 'Jane Smith', department: 'Administration', phone: '(123) 555-4567' },
    { name: 'Alice Johnson', department: 'Customer Service', phone: '(456) 555-7890' },
    { name: 'Bob Brown', department: 'Human Resources', phone: '(789) 555-1234' },
  ]);

  const [newRow, setNewRow] = useState({ name: '', department: '', phone: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Handle Add Row
  const handleAddRow = () => {
    if (newRow.name && newRow.department && newRow.phone) {
      setRows([...rows, newRow]);
      setNewRow({ name: '', department: '', phone: '' });
      setIsAdding(false);
    }
  };

  // Handle Delete Row
  const handleDeleteRow = (index) => {
    setShowDeleteConfirm(true);
    setDeleteIndex(index);
  };

  // Confirm Delete
  const confirmDelete = () => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== deleteIndex);
    setRows(updatedRows);
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };

  // Cancel Delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };

  // Handle Edit Row
  const handleEditRow = (index) => {
    setNewRow(rows[index]);
    setIsAdding(true);
    setEditIndex(index);
  };

  // Handle Update Row
  const handleUpdateRow = () => {
    if (newRow.name && newRow.department && newRow.phone) {
      const updatedRows = [...rows];
      updatedRows[editIndex] = newRow;
      setRows(updatedRows);
      setNewRow({ name: '', department: '', phone: '' });
      setIsAdding(false);
      setEditIndex(null);
    }
  };

  // Filter and Search Logic
  const filteredRows = rows.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          row.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          row.phone.includes(searchTerm);
    const matchesFilter = filterDepartment ? row.department === filterDepartment : true;
    return matchesSearch && matchesFilter;
  });

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Departments for Filter
  const departments = [...new Set(rows.map((row) => row.department))];

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center pb-4 mb-4 border-b">
            <h2 className="text-2xl font-semibold">Employee <b>Details</b></h2>
            <button
              type="button"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition"
              onClick={() => {
                setIsAdding(true);
                setEditIndex(null);
              }}
            >
              <i className="fa fa-plus mr-2"></i> Add New
            </button>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-4 flex space-x-4">
            <input
              type="text"
              placeholder="Search by name, department, or phone"
              className="form-control w-full py-2 px-3 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="form-control py-2 px-3 border border-gray-300 rounded-md"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Show form if adding or editing */}
              {(isAdding || editIndex !== null) && (
                <tr>
                  <td>
                    <input
                      type="text"
                      className="form-control w-full py-2 px-3 border border-gray-300 rounded-md"
                      value={newRow.name}
                      onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control w-full py-2 px-3 border border-gray-300 rounded-md"
                      value={newRow.department}
                      onChange={(e) => setNewRow({ ...newRow, department: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control w-full py-2 px-3 border border-gray-300 rounded-md"
                      value={newRow.phone}
                      onChange={(e) => setNewRow({ ...newRow, phone: e.target.value })}
                    />
                  </td>
                  <td className="flex space-x-2">
                    <button
                      className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition"
                      onClick={editIndex === null ? handleAddRow : handleUpdateRow}
                    >
                      {editIndex === null ? 'Add' : 'Update'}
                    </button>
                  </td>
                </tr>
              )}

              {/* Table rows */}
              {currentRows.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{row.name}</td>
                  <td className="px-4 py-2">{row.department}</td>
                  <td className="px-4 py-2">{row.phone}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      className="bg-yellow-500 text-white py-2 px-4 rounded-full hover:bg-yellow-600 transition"
                      onClick={() => handleEditRow(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition"
                      onClick={() => handleDeleteRow(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(filteredRows.length / rowsPerPage) }, (_, i) => (
              <button
                key={i + 1}
                className={`mx-1 px-4 py-2 rounded-full ${
                  currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl mb-4">Are you sure you want to delete this row?</h3>
            <div className="flex space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;