import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSubjects,
  createSubject,
  updateSubjectById,
  deleteSubjectById,
  updateSubjectLiveStatus,
  getLiveSubjects,
} from "../redux/actions/subjectaction"; // Import actions

export const useSubjectData = () => {
  const { subjects, liveSubjects } = useSelector((state) => state.subject);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSubjects());
    dispatch(getLiveSubjects());
  }, [dispatch]);

  const addSubject = (newSubject) => {
    dispatch(createSubject(newSubject));
  };

  const updateSubject = (id, updatedSubject) => {
    dispatch(updateSubjectById(id, updatedSubject));
  };
  const deleteSubject = (id, deletedSubject) => {
    dispatch(deleteSubjectById(id, deletedSubject));
  };
  const toggleSubjectLiveStatus = (id) => {
    dispatch(updateSubjectLiveStatus(id)); // Dispatch the new action to toggle isLive
  };

  return {
    subjects,
    liveSubjects,
    addSubject,
    updateSubject,
    deleteSubject,
    toggleSubjectLiveStatus,
  };
};
