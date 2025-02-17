import React, { useState, useEffect } from "react";
import { Button, Input, Checkbox, Textarea } from "@material-tailwind/react";
import { useAreaData } from "../../hook/areaData";
import { useSubjectData } from "../../hook/subjectData";
import { useDispatch } from "react-redux";
// import Select from "react-select";
import {
  createTeacher,
  updateTeacherById,
  getAllTeachers,
} from "../../redux/actions/teacherAction.js";

const ModalOpenTeacher = ({
  open,
  handleClose,
  handleSave,
  isEditing,
  data,
}) => {
  // console.log(data)
  const { liveAreas: areas } = useAreaData();
  const { liveSubjects: subjects } = useSubjectData();
  const dispatch = useDispatch();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aboutUs, setAboutUs] = useState("");
  const [chargeRate, setChargeRate] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [areaId, setAreaId] = useState("");
  const [image, setImage] = useState(null);
  const [imagePrev, setImagePrev] = useState("");

  // console.log("page refresh")

  // Effect: Reset form fields when modal opens
  // Effect: Reset form fields when modal opens
  useEffect(() => {
    if (!open) return; // Prevent execution if modal is closed

    if (isEditing && data) {
      setName(data?.name || "");
      setEmail(data?.email || "");
      setPhone(data?.phone || "");
      setAboutUs(data?.aboutUs || "");
      setChargeRate(data?.chargeRate || "");
      setSelectedSubjects(data?.subject?.map((sub) => sub._id) || []);
      setAreaId(data?.area?._id || "");
      setImage(null);
      setImagePrev(data?.image?.url || "");
    } else {
      // Clear form only when opening for a new teacher
      setName("");
      setEmail("");
      setPhone("");
      setAboutUs("");
      setChargeRate("");
      setSelectedSubjects([]);
      setAreaId("");
      setImage(null);
      setImagePrev("");
    }
  }, [open, isEditing, data]); // ✅ Dependencies are minimal now

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePrev(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePrev("");
    }
  };

  // Handle subject selection
  const handleSubjectChange = (subjectId) => {
    setSelectedSubjects((prevSelected) =>
      prevSelected.includes(subjectId)
        ? prevSelected.filter((id) => id !== subjectId)
        : [...prevSelected, subjectId]
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("aboutUs", aboutUs);
    formData.append("chargeRate", chargeRate);
    formData.append("subjectId", selectedSubjects.join(","));
    formData.append("areaId", areaId);
    formData.append("file", image);

    try {
      dispatch(createTeacher(formData)).then(() => {
        dispatch(getAllTeachers()); // Re-fetch teachers after add
      });
      console.log("Submit successful");
      handleSave();
    } catch (error) {
      console.error("Error adding teacher:", error);
      alert("Failed to add teacher.");
    }
  };

  const handleEditTeacher = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("aboutUs", aboutUs);
    formData.append("chargeRate", chargeRate);
    formData.append("subjectId", selectedSubjects.join(","));
    formData.append("areaId", areaId);
    if (image) {
      formData.append("file", image); // Only append image if a new one is selected
    }
    // Debugging: Log FormData values
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      dispatch(updateTeacherById(data._id, formData)).then(() => {
        dispatch(getAllTeachers()); // Re-fetch teachers after add
      }); // Assuming `data._id` contains the teacher ID
      console.log("Update successful");
      handleSave(); // Close modal and refresh data
    } catch (error) {
      console.error("Error updating teacher:", error);
      alert("Failed to update teacher.");
    }
  };

  return (
    <>
      {open && (
        <div className="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="modal-content p-6 bg-white rounded-lg  max-w-4xl w-full">
            <h2 className="text-2xl mb-4">
              {isEditing ? "Edit Teacher" : "Add Teacher"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium">Phone</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter Phone"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium">About Us</label>
                <Textarea
                  value={aboutUs}
                  onChange={(e) => setAboutUs(e.target.value)}
                />
              </div>
              
              <div className="col-span-1 ">
                <label className="block text-sm font-medium">Subjects</label>
                <div className="h-20 overflow-y-auto p-1 border rounded">
                  {subjects.map((subject) => (
                    <div key={subject._id} className="flex items-center">
                      <Checkbox
                        checked={selectedSubjects.includes(subject._id)}
                        onChange={() => handleSubjectChange(subject._id)}
                      />
                      <span>{subject.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium">Area</label>
                <select
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value)}
                >
                  <option value="">Select Area</option>
                  {areas.map((area) => (
                    <option key={area._id} value={area._id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium">Charge Rate</label>
                <Input
                  value={chargeRate}
                  onChange={(e) => setChargeRate(e.target.value)}
                  placeholder="Enter Charge Rate"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium">
                  Upload Image
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePrev && <img src={imagePrev} alt="Preview" width="150" />}
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
                onClick={isEditing ? handleEditTeacher : handleSubmit}
              >
                {isEditing ? "Save Changes" : "Add Teacher"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalOpenTeacher;
