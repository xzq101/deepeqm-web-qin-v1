import axios from '../utils/axios';
import {
  CLASS_LIST_FOR_TEACHER_REQUEST,
  CLASS_LIST_FOR_TEACHER_SUCCESS,
  CLASS_LIST_FOR_TEACHER_FAIL,
  CLASS_LIST_FOR_TEACHER_RESET,
  CLASS_CREATE_REQUEST,
  CLASS_CREATE_SUCCESS,
  CLASS_CREATE_FAIL,
  CLASS_DETAILS_REQUEST,
  CLASS_DETAILS_SUCCESS,
  CLASS_DETAILS_FAIL,
  CLASS_DELETE_SUCCESS,
  CLASS_DELETE_REQUEST,
  CLASS_DELETE_FAIL,
  CLASS_UPDATE_REQUEST,
  CLASS_UPDATE_SUCCESS,
  CLASS_UPDATE_FAIL,
  CLASS_UPDATE_RESET,
  ADD_HW_TO_CLASS_REQUEST,
  ADD_HW_TO_CLASS_SUCCESS,
  ADD_HW_TO_CLASS_FAIL,
  ADD_HW_TO_CLASS_RESET,
  DELETE_HW_FROM_CLASS_REQUEST,
  DELETE_HW_FROM_CLASS_SUCCESS,
  DELETE_HW_FROM_CLASS_FAIL,
  DELETE_HW_FROM_CLASS_RESET,
} from '../constants/classConstants';
import {logout} from './userActions';

// 已重构
export const createClassByT = () => async (dispatch, getState) => {
  try {
    dispatch ({
      type: CLASS_CREATE_REQUEST,
    });

    const {result} = await axios.post (`/teacher/createClassByTeacher`, {
      language: window.localStorage.getItem ('lang') || 'en',
    });

    dispatch ({
      type: CLASS_CREATE_SUCCESS,
      payload: result,
    });
  } catch (error) {
    dispatch ({
      type: CLASS_CREATE_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const listTeacherClasses = (name) => async (dispatch, getState) => {
  try {
    dispatch ({
      type: CLASS_LIST_FOR_TEACHER_REQUEST,
    });
    const {result} = await axios.get (`/teacher/getClassesByTeacher`, {
      params: {
        name,
        language: window.localStorage.getItem ('lang') || 'en',
      }
    });

    dispatch ({
      type: CLASS_LIST_FOR_TEACHER_SUCCESS,
      payload: result.list,
    });
  } catch (error) {
    dispatch ({
      type: CLASS_LIST_FOR_TEACHER_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const deleteClassByTeach = id => async (dispatch, getState) => {
  try {
    dispatch ({
      type: CLASS_DELETE_REQUEST,
    });

    await axios.post (`/teacher/deleteClassByTeacher`, { id });

    dispatch ({
      type: CLASS_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch ({
      type: CLASS_DELETE_FAIL,
      payload: error.msg,
    });
  }
};

// 已重构
export const updateClassByTeach = uClass => async (dispatch, getState) => {
  try {
    dispatch ({
      type: CLASS_UPDATE_REQUEST,
    });

    const {result} = await axios.post (
      `/teacher/updateClassIntro`,
      uClass,
    );

    dispatch ({
      type: CLASS_UPDATE_SUCCESS,
      payload: result,
    });
    dispatch ({type: CLASS_LIST_FOR_TEACHER_SUCCESS, payload: result});
  } catch (error) {
    dispatch ({
      type: CLASS_UPDATE_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const ShowClassDetails = id => async dispatch => {
  try {
    dispatch ({type: CLASS_DETAILS_REQUEST});

    const {result} = await axios.get (`/public/getClassById?id=${id}`);

    dispatch ({
      type: CLASS_DETAILS_SUCCESS,
      payload: result,
    });
  } catch (error) {
    dispatch ({
      type: CLASS_DETAILS_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const addHWToClass = (ClassID, hw) => async (dispatch, getState) => {
  try {
    dispatch ({
      type: ADD_HW_TO_CLASS_REQUEST,
    });

    // console.log ('in addHWToClass', question);
    const {result} = await axios.post (
      `/teacher/addHWToClass`,
      {
        id: ClassID,
        ...hw,
      },
    );

    dispatch ({
      type: ADD_HW_TO_CLASS_SUCCESS,
    });
    //  dispatch ({type: HW_LIST_FOR_TEACHER_SUCCESS, payload: data});
  } catch (error) {
    dispatch ({
      type: ADD_HW_TO_CLASS_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const deleteHWFromClass = (classID, hwID) => async (
  dispatch,
  getState
) => {
  try {
    dispatch ({
      type: DELETE_HW_FROM_CLASS_REQUEST,
    });

    // console.log ('in deleteHWFromClass', hwID);
    await axios.post (`/teacher/deleteHWFromClass`, {
      hwID,
      id: classID
    });

    dispatch ({
      type: DELETE_HW_FROM_CLASS_SUCCESS,
    });
    //  dispatch ({type: HW_LIST_FOR_TEACHER_SUCCESS, payload: data});
  } catch (error) {
    dispatch ({
      type: DELETE_HW_FROM_CLASS_FAIL,
      payload: error.msg,
    });
  }
};
