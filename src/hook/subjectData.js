import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSubjects } from "../redux/actions/subjectaction";

export const useSubjectData = () => {
  const { subjects } = useSelector((state) => state.subject);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSubjects());
  }, [dispatch]);
  return subjects;
};
