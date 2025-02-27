import React, { useState, useEffect } from "react";
import { Button, Input, Checkbox, Textarea } from "@material-tailwind/react";
import { useAreaData } from "../../hook/areaData";
import { useSubjectData } from "../../hook/subjectData";
import { useDispatch } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  createStudent,
  updateStudentById,
  getAllStudents,
} from "../../redux/actions/studentAction";

const animatedComponents = makeAnimated();

const ModalOpenStudent = ({
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
  const [gender, setGender] = useState("");
  const [className, setClassName] = useState("");
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
      setGender(data?.gender || "");
      setClassName(data?.class || "");
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
    formData.append("gender", gender);
    formData.append("className", className);
    formData.append("aboutUs", aboutUs);
    formData.append("chargeRate", chargeRate);
    formData.append("subjectId", selectedSubjects.join(","));
    formData.append("areaId", areaId);
    formData.append("file", image);

    try {
      dispatch(createStudent(formData)).then(() => {
        dispatch(getAllStudents());
      });
      console.log("Submit successful");
      handleSave();
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student.");
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("gender", gender);
    formData.append("className", className);
    formData.append("aboutUs", aboutUs);
    formData.append("chargeRate", chargeRate);
    formData.append("subjectId", selectedSubjects.join(","));
    formData.append("areaId", areaId);
    if (image) {
      formData.append("file", image);
    }
    console.log("on edit", formData);

    try {
      dispatch(updateStudentById(data._id, formData)).then(() => {
        dispatch(getAllStudents());
      });
      console.log("Update successful");
      handleSave();
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student.");
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
                    )}
                    onChange={handleAreaChange}
                    e
                    options={areaOptions}
                    getOptionLabel={(e) => e.label}
                    getOptionValue={(e) => e.value}
                    className="w-full border rounded-lg text-sm"
                    isClearable={true}
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
