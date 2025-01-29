import React, { useState } from 'react';

const EmployeeTable = () => {
  const [rows, setRows] = useState([
    { name: 'John Doe', department: 'Administration', phone: '(171) 555-2222' },
    { name: 'Peter Parker', department: 'Customer Service', phone: '(313) 555-5735' },
    { name: 'Fran Wilson', department: 'Human Resources', phone: '(503) 555-9931' }
  ]);
  const [newRow, setNewRow] = useState({ name: '', department: '', phone: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // Track which row is being edited
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null); // Index for deleting

  const handleAddRow = () => {
    if (newRow.name && newRow.department && newRow.phone) {
      setRows([...rows, newRow]);
      setNewRow({ name: '', department: '', phone: '' });
      setIsAdding(false);
    }
  };

  const handleDeleteRow = (index) => {
    setShowDeleteConfirm(true); // Show delete confirmation
    setDeleteIndex(index); // Store the index to delete
  };

  const confirmDelete = () => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== deleteIndex);
    setRows(updatedRows);
    setShowDeleteConfirm(false);
    setDeleteIndex(null); // Reset delete index
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false); // Hide the delete confirmation modal
    setDeleteIndex(null);
  };

  const handleEditRow = (index) => {
    setNewRow(rows[index]); // Set the newRow state to the selected row's data
    setIsAdding(true); // Open the form in edit mode
    setEditIndex(index); // Track the row being edited
  };

  const handleUpdateRow = () => {
    if (newRow.name && newRow.department && newRow.phone) {
      const updatedRows = [...rows];
      updatedRows[editIndex] = newRow; // Replace the old row with the new one
      setRows(updatedRows);
      setNewRow({ name: '', department: '', phone: '' });
      setIsAdding(false);
      setEditIndex(null); // Reset edit index after updating
    }
  };

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
                setEditIndex(null); // Clear edit index for new entry
              }}
            >
              <i className="fa fa-plus mr-2"></i> Add New
            </button>
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
              {rows.map((row, index) => (
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
