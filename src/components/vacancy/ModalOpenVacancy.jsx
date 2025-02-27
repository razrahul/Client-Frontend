import React, { useState, useEffect } from "react";
import { Button, Input, Textarea } from "@material-tailwind/react";
import { useAreaData } from "../../hook/areaData";
import { useSubjectData } from "../../hook/subjectData";
import { useDispatch } from "react-redux";

import {
  createVacancy,
  updateVacancyById,
  getAllVacancies,
} from "../../redux/actions/vacancyActions.js";

const ModalOpenVacancy = ({
  open,
  handleClose,
  handleSave,
  isEditing,
  data,
}) => {
  const { liveAreas: areas } = useAreaData();
  const { liveSubjects: subjects } = useSubjectData();
  const dispatch = useDispatch();

  const [studentName, setStudentName] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(""); // single subject
  const [areaId, setAreaId] = useState(""); // single area

  useEffect(() => {
    if (!open) return;

    if (isEditing && data) {
      setStudentName(data?.studentName || "");
      setSelectedSubject(data?.subject?._id || "");
      setAreaId(data?.area?._id || "");
    } else {
      setStudentName("");
      setSelectedSubject("");
      setAreaId("");
    }
  }, [open, isEditing, data]);

  const handleSubjectChange = (subjectId) => {
    setSelectedSubject(subjectId);
  };

  const handleAreaChange = (areaId) => {
    setAreaId(areaId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      studentName,
      subjectId: selectedSubject,
      areaId,
    };

    try {
      dispatch(createVacancy(data)).then(() => {
        dispatch(getAllVacancies());
      });
      handleSave();
    } catch (error) {
      console.error("Error adding vacancy:", error);
      alert("Failed to add vacancy.");
    }
  };

  const handleEditVacancy = async (e) => {
    e.preventDefault();

    const dataToSend = {
      studentName,
      subjectId: selectedSubject,
      areaId,
    };

    try {
      dispatch(updateVacancyById(data._id, dataToSend)).then(() => {
        dispatch(getAllVacancies());
      });
      handleSave();
    } catch (error) {
      console.error("Error updating vacancy:", error);
      alert("Failed to update vacancy.");
    }
  };

  return (
    <>
      {open && (
        <div className="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="modal-content p-6 bg-white rounded-lg max-w-4xl w-full">
            <h2 className="text-2xl mb-4">
              {isEditing ? "Edit Vacancy" : "Add Vacancy"}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium">Class</label>
                <Input
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter Class"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium">Subject</label>
                <div className="relative">
                  <div className="h-28 overflow-y-auto border rounded-lg text-sm">
                    {subjects.map((subject) => (
                      <div
                        key={subject._id}
                        onClick={() => handleSubjectChange(subject._id)} // Handle selection by clicking
                        className={`p-2 cursor-pointer hover:bg-blue-500 ${
                          subject._id === selectedSubject
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                        }`}
                      >
                        {subject.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium">Area</label>
                <div className="relative">
                  <div className="h-28 overflow-y-auto border rounded-lg text-sm">
                    {areas.map((area) => (
                      <div
                        key={area._id}
                        onClick={() => handleAreaChange(area._id)}
                        className={`p-2 cursor-pointer hover:bg-blue-500 ${
                          area._id === areaId
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                        }`}
                      >
                        {area.name}
                      </div>
                    ))}
                  </div>
                </div>
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
                onClick={isEditing ? handleEditVacancy : handleSubmit}
              >
                {isEditing ? "Save Changes" : "Add Vacancy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalOpenVacancy;
