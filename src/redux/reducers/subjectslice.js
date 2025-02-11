import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    subjects: [],  // List of all subjects
    subject: {},   // A single subject, used for detail views or editing
    loading: false, // Indicates loading state during API requests
    error: null,    // Holds error message if API request fails
};

const subjectSlice = createSlice({
    name: "subject",
    initialState,
    reducers: {
        subjectRequest(state) {
            state.loading = true;
            state.error = null;
        },
        fetchSubjectsSuccess(state, action) {
            state.loading = false;
            state.subjects = action.payload.subjects;  // Update subjects with the fetched data
        },
        subjectFail(state, action) {
            state.loading = false;
            state.error = action.payload;  // Store the error message
        },
        getSubject(state, action) {
            state.loading = false;
            state.subject = action.payload;  // Set the current subject, used for editing or details
        },
        addSubject(state, action) {
            state.loading = false;  // Set loading to false after the subject is added
            state.subjects.push(action.payload);  // Add the new subject to the list
        },
        updateSubject(state, action) {
            state.loading = false;  // Set loading to false after the update is done
            const index = state.subjects.findIndex(subject => subject._id === action.payload._id);
            if (index !== -1) {
                state.subjects[index] = action.payload;  // Update the subject
            }
        },
        removeSubject(state, action) {
            state.loading = false;  // Set loading to false after the removal is done
            state.subjects = state.subjects.filter(subject => subject._id !== action.payload); // Remove subject by ID
        },
        resetSubjectState(state) {
            state.subject = {}; // Reset the single subject state
            state.error = null;  // Reset any errors
        },
    },
});

export const {
    subjectRequest,
    fetchSubjectsSuccess,
    subjectFail,
    getSubject,
    addSubject,
    updateSubject,
    removeSubject,
    resetSubjectState,
} = subjectSlice.actions;

export default subjectSlice.reducer;