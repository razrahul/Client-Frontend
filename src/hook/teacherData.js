import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTeachers,
  createTeacher,
  updateTeacherById,
  deleteTeacher,
} from "../redux/actions/teacherAction";

export const useTeacherData = () => {
  const { teachers } = useSelector((state) => state.teacher);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllTeachers());
  }, [dispatch]);

  // Add teacher function
  const addTeacher = async (fromData) => {
    dispatch(createTeacher(fromData)); // Dispatch the async action
  };

  const updateTeacher = (id, fromData) => {
    dispatch(updateTeacherById(id, fromData));
  };

  const deleteTeacherHook = (id) => {
    dispatch(deleteTeacher(id));
    console.log("delete teacher", id);
  };

  return {
    teachers,
    updateTeacher,

    addTeacher,
    deleteTeacherHook,
  };
};
