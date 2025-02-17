import React, { useState, useEffect } from "react";
import { Button, Input, Checkbox, Textarea } from "@material-tailwind/react";
import { useAreaData } from "../../hook/areaData";
import { useSubjectData } from "../../hook/subjectData";
import { useDispatch } from "react-redux";
// import Select from "react-select";
import {
  createStudent,
  updateStudentById,
  getAllStudents,
} from "../../redux/actions/studentAction";

const ModalOpenStudent = ({
  open,
  handleClose,
  handleSave,
  isEditing,
  data,
}) => {
  // Fetch areas and subjects like in the teacher modal
  const { liveAreas:areas } = useAreaData();
  const { liveSubjects: subjects } = useSubjectData();
  const dispatch = useDispatch();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState(""); // Gender state
  const [className, setClassName] = useState(""); // Class state
  const [aboutUs, setAboutUs] = useState("");
  const [chargeRate, setChargeRate] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [areaId, setAreaId] = useState("");
  const [image, setImage] = useState(null);
  const [imagePrev, setImagePrev] = useState("");

  // Effect to reset the form when the modal opens or data changes
  useEffect(() => {
    if (!open) return; // Prevent execution if modal is closed

    if (isEditing && data) {
      setName(data?.name || "");
      setEmail(data?.email || "");
      setPhone(data?.phone || "");
      setGender(data?.gender || "");
      setClassName(data?.className || "");
      setAboutUs(data?.aboutUs || "");
      setChargeRate(data?.chargeRate || "");
      setSelectedSubjects(data?.subjects?.map((sub) => sub._id) || []);
      setAreaId(data?.area?._id || "");
      setImage(null);
      setImagePrev(data?.image?.url || "");
    } else {
      // Reset form if opening for a new student
      setName("");
      setEmail("");
      setPhone("");
      setGender("");
      setClassName("");
      setAboutUs("");
      setChargeRate("");
      setSelectedSubjects([]);
      setAreaId("");
      setImage(null);
      setImagePrev("");
    }
  }, [open, isEditing, data]);

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

  // Handle form submission for creating a new student
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    console.log(name, email, phone, gender, className, aboutUs, chargeRate, selectedSubjects, areaId, image);

    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("gender", gender); // Adding gender to form data
    formData.append("className", className); // Adding class to form data
    formData.append("aboutUs", aboutUs);
    formData.append("chargeRate", chargeRate);
    formData.append("subjectId", selectedSubjects.join(","));
    formData.append("areaId", areaId);
    formData.append("file", image);
    console.log([...formData]); // Log the FormData to see its contents

    try {
      dispatch(createStudent(formData)).then(() => {
        dispatch(getAllStudents()); // Re-fetch students after adding
      });
      console.log("Submit successful");
      handleSave();
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student.");
    }
  };

  // Handle form submission for editing an existing student
  const handleEditStudent = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("gender", gender); // Adding gender to form data
    formData.append("className", className); // Adding class to form data
    formData.append("aboutUs", aboutUs);
    formData.append("chargeRate", chargeRate);
    formData.append("subjectId", selectedSubjects.join(","));
    formData.append("areaId", areaId);
    if (image) {
      formData.append("file", image); // Only append image if a new one is selected
    }
    console.log("on edit" ,formData);

    try {
      dispatch(updateStudentById(data._id, formData)).then(() => {
        dispatch(getAllStudents()); // Re-fetch students after update
      });
      console.log("Update successful");
      handleSave(); // Close modal and refresh data
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student.");
    }
  };

  return (
    <>
      {open && (
        <div className="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="modal-content p-6 bg-white rounded-lg max-w-4xl w-full">
            <h2 className="text-2xl mb-4">
              {isEditing ? "Edit Student" : "Add Student"}
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
                <label className="block text-sm font-medium">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium">Class</label>
                <Input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Enter Class"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium">About Us</label>
                <Textarea
                  value={aboutUs}
                  onChange={(e) => setAboutUs(e.target.value)}
                />
              </div>
              <div className="col-span-1">
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
                onClick={isEditing ? handleEditStudent : handleSubmit}
              >
                {isEditing ? "Save Changes" : "Add Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalOpenStudent;
