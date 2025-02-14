import axios from "axios";

const server = import.meta.env.VITE_BACKEND_URL;

import {
    teacherRequest,
    fetchTeachersSuccess,
    teacherFail,
    addTeacher,
    removeTeacher,
    updateTeacher,
    getTeacher,

} from "../reducers/teacherSlice";

//get All Teachers
export const getAllTeachers = () => async (dispatch) => {
    try {
        dispatch(teacherRequest());

        const { data } = await axios.get(`${server}/getTeachers`);

        dispatch(fetchTeachersSuccess(data));
    } catch (error) {
        // return async (dispatch) => {
        //     dispatch(
        //         teacherFail(error.response?.data?.message || "Failed to fetch teacher")
        //     );
        // };
        dispatch(
            teacherFail(error.response?.data?.message || "Failed to fetch teachers")
          );
    }
};

//get teacher by id
export const getTeacherById = (id) => async (dispatch) => {
    try {
        dispatch(teacherRequest());

        const { data } = await axios.get(`${server}/getTeacherById/${id}`);

        dispatch(getTeacher(data));
    } catch (error) {
        return async (dispatch) => {
            dispatch(
                teacherFail(error.response?.data?.message || "Failed to fetch teacher")
            );
        };
    }
};

//create Teacher
// export const createTeacher = (teacher) => async (dispatch) => {
//     try {
//         dispatch(teacherRequest());

//         const { data } = await axios.post(`${server}/createTeacher`,
//             teacher,
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 withCredentials: true,
//             }
//         );

//         dispatch(addTeacher(data));
//     } catch (error) {
//         return async (dispatch) => {
//             dispatch(
//                 teacherFail(error.response?.data?.message || "Failed to create teacher")
//             );
//         };
//     }
// };
// export const createTeacher = (teacher, imageFile) => async (dispatch) => {
//     try {
//       dispatch(teacherRequest());  // Dispatching the initial loading action
  
//       // Creating FormData to send the image along with the data
//       const teacherData = new FormData();
//       formData.append("name", teacher.name);
//       formData.append("email", teacher.email);
//       formData.append("phone", teacher.phone);
//       formData.append("aboutUs", teacher.aboutUs || "");
//       formData.append("chargeRate", teacher.chargeRate || "100-200");
  
//       // Checking if the city and subject are valid
//       if (teacher.city && teacher.city._id) {
//         formData.append("areaId", teacher.city._id);
//       }
  
//       if (teacher.subject && teacher.subject.length > 0) {
//         formData.append("subjectId", teacher.subject);
//       }
  
//       if (imageFile) {
//         formData.append("file", imageFile);
//       } else {
//         console.warn("No image file selected!");
//       }

//       console.log(teacherData);
      
  
//       // Making the API call
//     //   const { data } = await axios.post(`${server}/createTeacher`, formData, {
//     //     headers: {
//     //       "Content-Type": "multipart/form-data",
//     //     },
//     //     withCredentials: true,
//     //   });
  
//       // Dispatching a plain action with the response data
//       dispatch(addTeacher(data));  // addTeacher is assumed to be a normal action creator
//     } catch (error) {
//       console.error("Error adding teacher:", error);
//       dispatch(teacherFail("Failed to add teacher. Please try again.")); // Dispatch failure action
//     }
//   };


  export const createTeacher = (formData) => async (dispatch) => {
    try {
      dispatch(teacherRequest());
  
      const { data } = await axios.post(`${server}/createTeacher`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
  
      dispatch(addTeacher(data));
    } catch (error) {
      dispatch(
        teacherFail(
          error.response?.data?.message ||
            "Failed to create the Teacher. Please try again."
        )
      );
    }
  };
  




//updae Teacher
export const updateTeacherById = (id, formData) => async (dispatch) => {
    try {
        dispatch(teacherRequest());

        const { data } = await axios.put(`${server}/updateTeacher/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            }
        );

        dispatch(updateTeacher(data));
    } catch (error) {
        return async (dispatch) => {
            dispatch(
                teacherFail(error.response?.data?.message || "Failed to update teacher")
            );
        };
    }
};

//delete Teacher
export const deleteTeacher = (id) => async (dispatch) => {
    try {
        dispatch(teacherRequest());

        await axios.delete(`${server}/deleteTeacher/${id}`);

        dispatch(removeTeacher({data, id}));
    } catch (error) {
        return async (dispatch) => {
            dispatch(
                teacherFail(error.response?.data?.message || "Failed to delete teacher")
            );
        };
    }
};