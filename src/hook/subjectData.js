import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSubjects,
  createSubject,
  updateSubjectById,
  deleteSubjectById,
} from "../redux/actions/subjectaction"; // Import actions

export const useSubjectData = () => {
  const { subjects } = useSelector((state) => state.subject);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSubjects());
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

  return { subjects, addSubject, updateSubject,deleteSubject };
};
