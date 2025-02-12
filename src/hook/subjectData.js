import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSubjects,
  createSubject,
  updateSubjectById,
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

  return { subjects, addSubject, updateSubject };
};
