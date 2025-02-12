import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    subjects: [],  
    subject: {},   
    loading: false, 
    error: null,   
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
            state.subjects = action.payload.subjects;  
        },
        subjectFail(state, action) {
            state.loading = false;
            state.error = action.payload;  
        },
        getSubject(state, action) {
            state.loading = false;
            state.subject = action.payload;  
        },
        addSubject(state, action) {
            state.loading = false;  
            state.subjects.push(action.payload);  
        },
        updateSubject(state, action) {
            state.loading = false;  
            const index = state.subjects.findIndex(subject => subject._id === action.payload._id);
            if (index !== -1) {
                state.subjects[index] = action.payload;  
            }
        },
        removeSubject(state, action) {
            state.loading = false;  
            state.subjects = state.subjects.filter(subject => subject._id !== action.payload); // Remove subject by ID
        },
        resetSubjectState(state) {
            state.subject = {}; 
            state.error = null;  
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