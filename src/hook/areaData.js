import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAreas } from "../redux/actions/areaAction";

export const useAreaData = () => {
  const { areas } = useSelector((state) => state.area);
  const dispatch = useDispatch();
 
  useEffect(() => {
    dispatch(getAreas());
  }, [dispatch]);

  return areas;
};