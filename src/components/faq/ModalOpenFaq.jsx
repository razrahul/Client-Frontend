import React from "react";

const ModalOpenFaq = ({
  open,
  handleClose,
  handleSave,
  formData,
  setFormData,
  isEditing,
}) => {
  const handleSubmit = () => {
    handleSave();
  };

  return (
    open && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-lg">
          <h2 className="text-2xl mb-4">
            {isEditing ? "Edit FAQ" : "Add FAQ"}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Question
              </label>
              <input
                className="w-full p-2 border rounded"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                placeholder="Enter question"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Answer
              </label>
              <textarea
                className="w-full p-2 border rounded"
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                placeholder="Enter answer"
                rows="4"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
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
    )
  );
};

export default ModalOpenFaq;
