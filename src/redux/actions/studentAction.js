import axios from "axios";

const server = import.meta.env.VITE_BACKEND_URL;

// Import the necessary actions from the studentSlice
import {
    studentRequest,
    fetchStudentsSuccess,
    studentFail,
    addStudent,
    removeStudent,
    updateStudent,
    getStudent,
} from "../reducers/studentSlice";

// Get All Students
export const getAllStudents = () => async (dispatch) => {
    try {
        dispatch(studentRequest());

        const { data } = await axios.get(`${server}/student`);

        dispatch(fetchStudentsSuccess(data));
    } catch (error) {
        dispatch(
            studentFail(error.response?.data?.message || "Failed to fetch students")
        );
    }
};

// Get Student by ID
export const getStudentById = (id) => async (dispatch) => {
    try {
        dispatch(studentRequest());

        const { data } = await axios.get(`${server}/student/${id}`);

        dispatch(getStudent(data));
    } catch (error) {
        dispatch(
            studentFail(error.response?.data?.message || "Failed to fetch student")
        );
    }
};

// Create a Student
export const createStudent = (studentData) => async (dispatch) => {
    try {
        dispatch(studentRequest());

        const { data } = await axios.post(`${server}/student`, studentData);

        dispatch(addStudent(data));
    } catch (error) {
        dispatch(
            studentFail(error.response?.data?.message || "Failed to create student")
        );
    }
};

// Update Student
export const updateStudentById = (id, studentData) => async (dispatch) => {
    try {
        dispatch(studentRequest());

        const { data } = await axios.put(`${server}/student/${id}`, studentData);

        dispatch(updateStudent(data));
    } catch (error) {
        dispatch(
            studentFail(error.response?.data?.message || "Failed to update student")
        );
    }
};

// Delete Student
export const deleteStudentById = (id) => async (dispatch) => {
    try {
        dispatch(studentRequest());

        const { data } = await axios.delete(`${server}/student/${id}`);

        dispatch(removeStudent(data));
    } catch (error) {
        dispatch(
            studentFail(error.response?.data?.message || "Failed to delete student")
        );
    }
};
