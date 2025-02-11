import React from "react";

const ModalOpenSubject = ({ open, handleClose, handleSave, formData, setFormData, isEditing }) => {
  return (
    <>
      {open && (
        <div className="modal-overlay">
          <div className="modal-content fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-white rounded-lg shadow-lg max-h-[80vh] w-full sm:w-4/5 md:w-2/3 overflow-auto">
            <h2 className="text-2xl mb-4">
              {isEditing ? "Edit Subject" : "Add New Subject"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject Name</label>
                <input
                  type="text"
                  className="mt-1 w-full border-gray-300 rounded-md p-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  className="mt-1 w-full border-gray-300 rounded-md p-2"
                  value={formData.isLive}
                  onChange={(e) => setFormData({ ...formData, isLive: e.target.value === 'true' })}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={handleSave}
              >
                {isEditing ? "Save Changes" : "Add Subject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalOpenSubject;
