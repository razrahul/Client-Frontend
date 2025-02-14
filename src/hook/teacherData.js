import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTeachers, createTeacher } from "../redux/actions/teacherAction";
import { getLiveSubjects } from "../redux/actions/subjectaction";
import { getLiveAreas } from "../redux/actions/areaAction";

export const useTeacherData = () => {
  const { teachers } = useSelector((state) => state.teacher);
  const { subjects } = useSelector((state) => state.subject); // Assuming subjects are in this state
  const { areas } = useSelector((state) => state.area); // Assuming areas are in this state
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getAllTeachers());
    dispatch(getLiveSubjects());
    dispatch(getLiveAreas());
  }, [dispatch]);

  // Use effect to monitor when the data is available
  useEffect(() => {
    if (teachers.length > 0 && subjects.length > 0 && areas.length > 0) {
      setLoading(false); // Set loading to false once all data is fetched
    }
  }, [teachers, subjects, areas]);

  // Add teacher function
  const addTeacher = async(newTeacher) => {
    try {
      // Wait for the teacher to be added
      await dispatch(createTeacher(newTeacher)); // Dispatch the async action
      console.log("Teacher added successfully");
    } catch (error) {
      console.error("Failed to add teacher", error);
    }
  };

  // Fetch subjects by ID (if needed)
  const getSubjectLiveId = (id) => {
    dispatch(getLiveSubjects(id));
  };

  // Fetch areas by ID (if needed)
  const getLiveAreasId = (id) => {
    dispatch(getLiveAreas(id));
  };

  return {
    teachers,
    subjects,
    areas,
    addTeacher,
    getSubjectLiveId,
    getLiveAreasId,
    loading,
  };
};
