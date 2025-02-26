import React, { useState, useEffect } from "react";
import { Button, Input, Textarea } from "@material-tailwind/react";
import { useAreaData } from "../../hook/areaData";
import { useSubjectData } from "../../hook/subjectData";
import { useDispatch } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import {
  createTeacher,
  updateTeacherById,
  getAllTeachers,
} from "../../redux/actions/teacherAction.js";

const animatedComponents = makeAnimated();

const ModalOpenTeacher = ({
  open,
  handleClose,
  handleSave,
  isEditing,
  data,
}) => {
  const { liveAreas: areas } = useAreaData();
  const { liveSubjects: subjects } = useSubjectData();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aboutUs, setAboutUs] = useState("");
  const [chargeRate, setChargeRate] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [areaId, setAreaId] = useState("");
  const [image, setImage] = useState(null);
  const [imagePrev, setImagePrev] = useState("");

  useEffect(() => {
    if (!open) return;

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
  }, [open, isEditing, data]);

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

  const handleSubjectChange = (selectedOptions) => {
    setSelectedSubjects(selectedOptions.map((option) => option.value));
  };

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

    try {
      dispatch(updateTeacherById(data._id, formData)).then(() => {
        dispatch(getAllTeachers()); // Re-fetch teachers after edit
      });
      console.log("Update successful");
      handleSave(); // Close modal and refresh data
    } catch (error) {
      console.error("Error updating teacher:", error);
      alert("Failed to update teacher.");
    }
  };

  const subjectOptions = subjects.map((subject) => ({
    value: subject._id,
    label: subject.name,
  }));

  const areaOptions = areas.map((area) => ({
    value: area._id,
    label: area.name,
  }));

  const handleAreaChange = (selectedOption) => {
    setAreaId(selectedOption ? selectedOption.value : "");
  };

  return (
    <>
      {open && (
        <div className="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="modal-content p-6 bg-white rounded-lg max-w-4xl w-full">
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

              <div className="col-span-1">
                <label className="block text-sm font-medium">Subjects</label>
                <div className="relative z-10">
                  <Select
                    menuPortalTarget={document.body} // ensures the dropdown is rendered outside the modal container
                    menuPosition="fixed" // keeps dropdown in place
                    isMulti
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    value={subjectOptions.filter((option) =>
                      selectedSubjects.includes(option.value)
                    )}
                    onChange={handleSubjectChange}
                    options={subjectOptions}
                    className="w-full border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium">Area</label>
                <div className="relative">
                  <Select
                    value={areaOptions.find(
                      (option) => option.value === areaId
                    )} // Set the selected area
                    onChange={handleAreaChange} // Handle change
                    options={areaOptions} // Pass the area options
                    getOptionLabel={(e) => e.label} // Custom label rendering for options
                    getOptionValue={(e) => e.value} // Custom value extraction for selected option
                    className="w-full border rounded-lg text-sm"
                    isClearable={true} // Allow clearing the selection if needed
                  />
                </div>
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
