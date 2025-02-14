import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  Option,
  Checkbox,
  Textarea,
} from "@material-tailwind/react";
import { useTeacherData } from "../../hook/teacherData";
import { useDispatch } from "react-redux"; // Import useDispatch


const ModalOpenTeacher = ({
  open,
  handleClose,
  handleSave,
  formData,
  setFormData,
  isEditing,
}) => {
  const { subjects, areas, addTeacher } = useTeacherData();
  const dispatch = useDispatch(); // Use dispatch hook to access dispatch

  const [imageFile, setImageFile] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState(formData.subject || []);
  const [selectedArea, setSelectedArea] = useState(formData.city?._id || "");

  // Handle Area Change
  const handleAreaChange = (value) => {
    const selectedAreaId = value;
    setSelectedArea(selectedAreaId);
    setFormData((prev) => ({
      ...prev,
      city: { _id: selectedAreaId }, // Only store _id of the city
    }));
  };

  // Handle Subject Change
  const handleSubjectChange = (subjectId) => {
    setSelectedSubjects((prevSelected) => {
      // Check if the subject is already selected or not
      if (prevSelected.includes(subjectId)) {
        return prevSelected.filter((id) => id !== subjectId); // Remove the subject
      } else {
        return [...prevSelected, subjectId]; // Add the subject
      }
    });
  };

  // Update the form data whenever selected subjects change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      subject: selectedSubjects, // Update formData with the selected subject IDs
    }));
  }, [selectedSubjects, setFormData]); // Ensure useEffect triggers when selectedSubjects changes

  // const handleSubmit = async () => {
  //   console.log("Form Data Submitted:", formData);

  //   if (
  //     !formData.name ||
  //     !formData.email ||
  //     !formData.phone ||
  //     selectedSubjects.length === 0 || // Ensure at least one subject is selected
  //     !formData.city._id
  //   ) {
  //     alert("Please fill all the fields.");
  //     return;
  //   }

  //   const newTeacher = {
  //     ...formData,
  //     city: { _id: formData.city._id }, // Only send _id for the area
  //     subject: selectedSubjects, // Send the array of subject IDs
  //     image: file ? URL.createObjectURL(file) : "", // Handle image if provided
  //     chargeRate: formData.chargeRate || "100-200", // Default if chargeRate is not provided
  //   };

  //   try {
  //     await addTeacher(newTeacher); // Await the async function call
  //     handleSave(); // Close the modal after saving
  //   } catch (error) {
  //     console.error("Error adding teacher:", error); // Handle error if any
  //   }
  // };

  const handleSubmit = async () => {
    console.log("Form Data Submitted:", formData);
    console.log("Image File Selected:", imageFile);
  
    if (!formData.name || !formData.email || !formData.phone || selectedSubjects.length === 0 || !formData.city._id) {
      alert("Please fill all the fields.");
      return;
    }
  
    if (!imageFile) {
      alert("No image file selected!");
      return;
    }
  
    const teacherData = {
      ...formData,
      subject: selectedSubjects,
      city: formData.city,
    };
  
    try {
      await dispatch(addTeacher(teacherData, imageFile));  // Make sure this passes the imageFile as part of the payload
      handleSave(); // Close modal after saving
    } catch (error) {
      console.error("Error adding teacher:", error);
      alert("Failed to add teacher. Please try again.");
    }
  };
  

  
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  useEffect(() => {
    setSelectedSubjects(formData.subject || []);
    setSelectedArea(formData.city?._id || "");
  }, [formData]);

  return (
    <>
      {open && (
        <div className="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="modal-content p-6 bg-white rounded-lg shadow-lg max-w-4xl w-full">
            <h2 className="text-2xl mb-4">
              {isEditing ? "Edit Teacher" : "Add Teacher"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Teacher's Name */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-900">Name</label>
                <Input
                  className="w-full p-2 border rounded"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter Teacher's Name"
                />
              </div>

              {/* Teacher's Email */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Input
                  className="w-full p-2 border rounded"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter Teacher's Email"
                />
              </div>

              {/* Teacher's Phone */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <Input
                  className="w-full p-2 border rounded"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter Teacher's Phone"
                />
              </div>

              {/* About Us */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">About Us</label>
                <Textarea
                  value={formData.aboutUs || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, aboutUs: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Subject List */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Subjects</label>
                <div className="h-40 overflow-y-auto p-2 border rounded">
                  {subjects.map((subject) => (
                    <div className="flex items-center space-x-2" key={subject._id}>
                      <Checkbox
                        label={subject.name}
                        checked={selectedSubjects.includes(subject._id)}
                        onChange={() => handleSubjectChange(subject._id)}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Area Dropdown */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <Select
                  value={selectedArea || ""} // This should be the area _id
                  onChange={handleAreaChange}
                  className="w-full border rounded"
                >
                  {areas.map((area) => (
                    <Option key={area._id} value={area._id}>
                      {area.name}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Charge Rate */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Charge Rate</label>
                <Input
                  className="w-full p-2 border rounded"
                  value={formData.chargeRate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, chargeRate: e.target.value })
                  }
                  placeholder="Enter Charge Rate"
                />
              </div>

              {/* Upload Image */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
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
                onClick={handleSubmit}
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



// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Input,
//   Select,
//   Option,
//   Checkbox,
//   Textarea,
// } from "@material-tailwind/react";
// import { useTeacherData } from "../../hook/teacherData";

// const ModalOpenTeacher = ({
//   open,
//   handleClose,
//   handleSave,
//   formData,
//   setFormData,
//   isEditing,
// }) => {
//   const { subjects, areas, addTeacher } = useTeacherData();
//   const [imageFile, setImageFile] = useState(null);
//   const [selectedSubjects, setSelectedSubjects] = useState(formData.subject || []);
//   const [selectedArea, setSelectedArea] = useState(formData.city?._id || "");

//   const handleAreaChange = (value) => {
//     const selectedAreaId = value; // Directly use the passed value (the area _id)
//     setSelectedArea(selectedAreaId); // Storing the selected area's _id
//     setFormData((prev) => ({
//       ...prev,
//       city: { _id: selectedAreaId }, // Storing only the _id in the city object
//     }));
//   };

//   const handleSubjectChange = (subjectId) => {
//     setSelectedSubjects((prevSelected) =>
//       prevSelected.includes(subjectId)
//         ? prevSelected.filter((id) => id !== subjectId) // Remove if already selected
//         : [...prevSelected, subjectId] // Add if not already selected
//     );
//   };

//   const handleSubmit = async () => {
//     console.log("Form Data Submitted:", formData);

//     if (
//       !formData.name ||
//       !formData.email ||
//       !formData.phone ||
//       selectedSubjects.length === 0 || // Ensure at least one subject is selected
//       !formData.city._id
//     ) {
//       alert("Please fill all the fields.");
//       return;
//     }

//     const newTeacher = {
//       ...formData,
//       city: { _id: formData.city._id }, // Only send _id for the area
//       subject: selectedSubjects, // Send the array of subject IDs
//       image: imageFile ? URL.createObjectURL(imageFile) : "", // Handle image if provided
//       chargeRate: formData.chargeRate || "100-200", // Default if chargeRate is not provided
//     };

//     try {
//       await addTeacher(newTeacher); // Await the async function call
//       handleSave(); // Close the modal after saving
//     } catch (error) {
//       console.error("Error adding teacher:", error); // Handle error if any
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setImageFile(file);
//   };

//   useEffect(() => {
//     setSelectedSubjects(formData.subject || []);
//     setSelectedArea(formData.city?._id || "");
//   }, [formData]);

//   return (
//     <>
//       {open && (
//         <div className="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
//           <div className="modal-content p-6 bg-white rounded-lg shadow-lg max-w-4xl w-full">
//             <h2 className="text-2xl mb-4">
//               {isEditing ? "Edit Teacher" : "Add Teacher"}
//             </h2>
//             <div className="grid grid-cols-2 gap-4">
//               {/* Teacher's Name */}
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-900">Name</label>
//                 <Input
//                   className="w-full p-2 border rounded"
//                   value={formData.name || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   placeholder="Enter Teacher's Name"
//                 />
//               </div>

//               {/* Teacher's Email */}
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700">Email</label>
//                 <Input
//                   className="w-full p-2 border rounded"
//                   value={formData.email || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, email: e.target.value })
//                   }
//                   placeholder="Enter Teacher's Email"
//                 />
//               </div>

//               {/* Teacher's Phone */}
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700">Phone</label>
//                 <Input
//                   className="w-full p-2 border rounded"
//                   value={formData.phone || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, phone: e.target.value })
//                   }
//                   placeholder="Enter Teacher's Phone"
//                 />
//               </div>

//               {/* About Us */}
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700">About Us</label>
//                 <Textarea
//                   value={formData.aboutUs || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, aboutUs: e.target.value })
//                   }
//                   className="w-full p-2 border rounded"
//                 />
//               </div>

//               {/* Subject List */}
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700">Subjects</label>
//                 <div className="h-40 overflow-y-auto p-2 border rounded">
//                   {subjects.map((subject) => (
//                     <div className="flex items-center space-x-2" key={subject._id}>
//                       <Checkbox
//                         label={subject.name}
//                         checked={selectedSubjects.includes(subject._id)}
//                         onChange={() => handleSubjectChange(subject._id)}
//                         className="text-sm"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Area Dropdown */}
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700">City</label>
//                 <Select
//                   value={selectedArea || ""} // This should be the area _id
//                   onChange={handleAreaChange} // Pass the value directly here
//                   className="w-full border rounded"
//                 >
//                   {areas.map((area) => (
//                     <Option key={area._id} value={area._id}>
//                       {area.name}
//                     </Option>
//                   ))}
//                 </Select>
//               </div>

//               {/* Charge Rate */}
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700">Charge Rate</label>
//                 <Input
//                   className="w-full p-2 border rounded"
//                   value={formData.chargeRate || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, chargeRate: e.target.value })
//                   }
//                   placeholder="Enter Charge Rate"
//                 />
//               </div>

//               {/* Upload Image */}
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700">Upload Image</label>
//                 <Input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             </div>

//             <div className="mt-4 flex justify-between">
//               <button
//                 className="bg-gray-500 text-white px-4 py-2 rounded-md"
//                 onClick={handleClose}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md"
//                 onClick={handleSubmit}
//               >
//                 {isEditing ? "Save Changes" : "Add Teacher"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ModalOpenTeacher;

// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Input,
//   Select,
//   Option,
//   Checkbox,
//   Textarea,
// } from "@material-tailwind/react";
// import { useTeacherData } from "../../hook/teacherData";

// const ModalOpenTeacher = ({
//   open,
//   handleClose,
//   handleSave,
//   formData,
//   setFormData,
//   isEditing,
// }) => {
//   const { subjects, areas, addTeacher } = useTeacherData();
//   const [imageFile, setImageFile] = useState(null);
//   const [selectedSubjects, setSelectedSubjects] = useState(
//     formData.subject || []
//   );
//   const [selectedArea, setSelectedArea] = useState(formData.city?.name || "");

//   const handleAreaChange = (e) => {
//     if (e && e.target) {
//       const selectedAreaId = e.target.value; // Getting the _id of the selected area
//       setSelectedArea(selectedAreaId); // Storing the selected area's _id
//       setFormData((prev) => ({
//         ...prev,
//         city: { _id: selectedAreaId }, // Storing only the _id in the city object
//       }));
//     }
//   };

//   const handleSubjectChange = (subjectId) => {
//     setSelectedSubjects(
//       (prevSelected) =>
//         prevSelected.includes(subjectId)
//           ? prevSelected.filter((id) => id !== subjectId) // Remove if already selected
//           : [...prevSelected, subjectId] // Add if not already selected
//     );
//     setFormData((prev) => ({
//       ...prev,
//       subject: selectedSubjects, // Update formData with the selected subject IDs
//     }));
//   };

//   const handleSubmit = async () => {
//     console.log("Form Data Submitted:", formData);

//     if (
//       !formData.name ||
//       !formData.email ||
//       !formData.phone ||
//       !formData.subject.length ||
//       !formData.city._id
//     ) {
//       alert("Please fill all the fields.");
//       return;
//     }

//     const newTeacher = {
//       ...formData,
//       city: { _id: formData.city._id }, // Only send _id for the area
//       subject: formData.subject, // Send the array of subject IDs
//       image: imageFile ? URL.createObjectURL(imageFile) : "", // Handle image if provided
//       chargeRate: formData.chargeRate || "100-200", // Default if chargeRate is not provided
//     };

//     try {
//       await addTeacher(newTeacher); // Await the async function call
//       handleSave(); // Close the modal after saving
//     } catch (error) {
//       console.error("Error adding teacher:", error); // Handle error if any
//     } // Close the modal after saving
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setImageFile(file);
//   };

//   useEffect(() => {
//     setSelectedSubjects(formData.subject || []);
//     setSelectedArea(formData.city?._id || "");
//   }, [formData]);

//   return (
//     <>
//       {open && (
//         <div className="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
//           <div className="modal-content p-6 bg-white rounded-lg shadow-lg max-w-4xl w-full">
//             <h2 className="text-2xl mb-4">
//               {isEditing ? "Edit Teacher" : "Add Teacher"}
//             </h2>
//             <div className="grid grid-cols-2 gap-4">
//               {/* Teacher's Name */}
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-900">
//                   Name
//                 </label>
//                 <Input
//                   className="w-full p-2 border rounded"
//                   value={formData.name || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   placeholder="Enter Teacher's Name"
//                 />
//               </div>

//               {/* Teacher's Email */}
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Email
//                 </label>
//                 <Input
//                   className="w-full p-2 border rounded"
//                   value={formData.email || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, email: e.target.value })
//                   }
//                   placeholder="Enter Teacher's Email"
//                 />
//               </div>

//               {/* Teacher's Phone */}
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Phone
//                 </label>
//                 <Input
//                   className="w-full p-2 border rounded"
//                   value={formData.phone || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, phone: e.target.value })
//                   }
//                   placeholder="Enter Teacher's Phone"
//                 />
//               </div>

//               {/* About Us */}
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700">
//                   About Us
//                 </label>
//                 <Textarea
//                   value={formData.aboutUs || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, aboutUs: e.target.value })
//                   }
//                   className="w-full p-2 border rounded"
//                 />
//               </div>

//               {/* Subject List */}
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Subjects
//                 </label>
//                 <div className="h-40 overflow-y-auto p-2 border rounded">
//                   {subjects.map((subject) => (
//                     <div
//                       className="flex items-center space-x-2"
//                       key={subject._id}
//                     >
//                       <Checkbox
//                         label={subject.name}
//                         checked={selectedSubjects.includes(subject._id)}
//                         onChange={() => handleSubjectChange(subject._id)}
//                         className="text-sm"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Area Dropdown */}
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700">
//                   City
//                 </label>
//                 <Select
//                   value={selectedArea || ""} // This should be the area _id
//                   onChange={handleAreaChange}
//                   className="w-full border rounded"
//                 >
//                   {areas.map((area) => (
//                     <Option key={area._id} value={area._id}>
//                       {area.name}
//                     </Option>
//                   ))}
//                 </Select>
//               </div>

//               {/* Charge Rate */}
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Charge Rate
//                 </label>
//                 <Input
//                   className="w-full p-2 border rounded"
//                   value={formData.chargeRate || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, chargeRate: e.target.value })
//                   }
//                   placeholder="Enter Charge Rate"
//                 />
//               </div>

//               {/* Upload Image */}
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Upload Image
//                 </label>
//                 <Input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             </div>

//             <div className="mt-4 flex justify-between">
//               <button
//                 className="bg-gray-500 text-white px-4 py-2 rounded-md"
//                 onClick={handleClose}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md"
//                 onClick={handleSubmit}
//               >
//                 {isEditing ? "Save Changes" : "Add Teacher"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ModalOpenTeacher;
