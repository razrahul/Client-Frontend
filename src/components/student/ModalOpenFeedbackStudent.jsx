import React, { useState, useEffect } from "react";
import { Button, Input, Textarea } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import {
  createFeedback,
  updateFeedbackAction,
  getAllFeedbacks,
} from "../../redux/actions/feedbackActions.js";
import { useStudentData } from "../../hook/studentData.js"; 

const ModalOpenFeedbackStudent = ({
  open,
  handleClose,
  handleSave,
  isEditing,
  data,
}) => {
  const { students } = useStudentData(); 
  const dispatch = useDispatch();

  const [userId, setUserId] = useState(""); 
  const [feedback, setFeedback] = useState(""); 
  const [rating, setRating] = useState(2); 

  useEffect(() => {
    if (!open) return; 

    if (isEditing && data) {
      setUserId(data?.userId || "");
      setFeedback(data?.feedback || "");
      setRating(data?.rating || 2); 
    } else {
      setUserId("");
      setFeedback("");
      setRating(2); 
    }
  }, [open, isEditing, data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      userId,
      feedback,
      rating,
    };

    try {
      await dispatch(createFeedback(formData)).then(() => {
        dispatch(getAllFeedbacks()); 
      });
      handleSave(); 
    } catch (error) {
      console.error("Error adding feedback:", error);
      alert("Failed to add feedback.");
    }
  };

  const handleEditFeedback = async (e) => {
    e.preventDefault(); 

    const formData = {
      userId,
      feedback,
      rating,
    };

    try {
      await dispatch(updateFeedbackAction(data._id, formData)).then(() => {
        dispatch(getAllFeedbacks()); 
      });
      handleSave(); 
    } catch (error) {
      console.error("Error updating feedback:", error);
      alert("Failed to update feedback.");
    }
  };

  return (
    <>
      {open && (
        <div className="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="modal-content p-6 bg-white rounded-lg max-w-4xl w-full">
            <h2 className="text-2xl mb-4">
              {isEditing ? "Edit Feedback" : "Add Feedback"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium">Select Student</label>
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="">Select student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium">Feedback</label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Write your feedback here"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium">Rating</label>
                <Input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  min="1"
                  max="5"
                />
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
                onClick={isEditing ? handleEditFeedback : handleSubmit}
              >
                {isEditing ? "Save Changes" : "Add Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalOpenFeedbackStudent;
