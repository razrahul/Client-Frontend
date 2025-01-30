import axios from "axios";

const server = import.meta.env.VITE_BACKEND_URL;

import {
  areaReaquest,
  fetchAreasSuccess,
  areaFail,
  addArea,
  removeArea,
  updateArea,
} from "../reducers/areaSlice";

//Get All Areas
export const getAreas = () => async (dispatch) => {
  try {
    dispatch(areaReaquest());

    const { data } = await axios.get(`${server}/getAreas`);

    dispatch(fetchAreasSuccess(data));
  } catch (error) {
    return async (dispatch) => {
      dispatch(
        areaFail(error.response?.data?.message || "Failed to fetch area")
      );
    };
  }
};

//create Area
export const createArea = (name) => async (dispatch) => {
  try {
    dispatch(areaReaquest());

    const { data } = await axios.post(`${server}/createArea`, 
        name,
        {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
        }
    );

    dispatch(addArea(data));
  } catch (error) {
    return async (dispatch) => {
      dispatch(
        areaFail(error.response?.data?.message || "Failed to create area")
      );
    };
  }
};

//update Area
export const editArea = (id, name) => async (dispatch) => {
  try {
    dispatch(areaReaquest());

    const { data } = await axios.put(`${server}/updateArea/${id}`,
        name,
        {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
        }
    );

    dispatch(updateArea(data));
  } catch (error) {
    return async (dispatch) => {
      dispatch(
        areaFail(error.response?.data?.message || "Failed to update area")
      );
    };
  }
};

// delete Area
export const deleteArea = (id) => async (dispatch) => {
  try {
    dispatch(areaReaquest());

    const {data} = await axios.delete(`${server}/deleteArea/${id}`, {
        withCredentials: true,
    });

    dispatch(removeArea(id, data));
  } catch (error) {
    return async (dispatch) => {
      dispatch(
        areaFail(error.response?.data?.message || "Failed to delete area")
      );
    };
  }
};
