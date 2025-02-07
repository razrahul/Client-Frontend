import React from "react";

const ModalOpenTeacher = ({
  open,
  handleClose,
  handleSave,
  formData,
  setFormData,
  isEditing,
}) => {
  // CSS styles for modal positioning
  const styles = `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
  `;

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    handleSave();
  };

  return (
    <>
      <style>{styles}</style>
      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-2xl mb-4">
              {isEditing ? "Edit Teacher" : "Add Teacher"}
            </h2>

            <div className="space-y-4">
              <div>
                <label>Name</label>
                <input
                  className="w-full p-2 border rounded"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Subjects</label>
                <input
                  className="w-full p-2 border rounded"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Hourly Rate</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={formData.chargeRate}
                  onChange={(e) =>
                    setFormData({ ...formData, chargeRate: e.target.value })
                  }
                />
              </div>

              <div>
                <label>City</label>
                <input
                  className="w-full p-2 border rounded"
                  value={formData.city?.name || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      city: { ...formData.city, name: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <label>Status</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.isLive ? "online" : "offline"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isLive: e.target.value === "online",
                    })
                  }
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSubmit}
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalOpenTeacher;