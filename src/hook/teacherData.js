import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTeachers, createTeacher, updateTeacherById, deleteTeacher } from "../redux/actions/teacherAction";
import { getLiveSubjects } from "../redux/actions/subjectaction";
import { getLiveAreas } from "../redux/actions/areaAction";

export const useTeacherData = () => {
  const { teachers } = useSelector((state) => state.teacher);
  const { subjects } = useSelector((state) => state.subject); // Assuming subjects are in this state
  const { areas } = useSelector((state) => state.area); // Assuming areas are in this state
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(getAllTeachers());
  }, [dispatch]);

  
  

  // Add teacher function
  const addTeacher = async(fromData) => {
    
       dispatch(createTeacher(fromData)); // Dispatch the async action
     
  };

  const updateTeacher = (id, fromData) => {
    dispatch(updateTeacherById(id, fromData));
  };

  const deleteTeacherHook = (id) => {
    dispatch(deleteTeacher(id));
    console.log("delete teacher",id);
    
  };
  

 
  

  return {
    teachers,
    updateTeacher,
    
    addTeacher,
    deleteTeacherHook
    
   
  };
};
