import axios from '../utils/axios';
import {
  HW_LIST_FOR_TEACHER_REQUEST,
  HW_LIST_FOR_TEACHER_SUCCESS,
  HW_LIST_FOR_TEACHER_FAIL,
  HW_LIST_FOR_TEACHER_RESET,
  HW_CREATE_REQUEST,
  HW_CREATE_SUCCESS,
  HW_CREATE_FAIL,
  HW_CREATE_RESET,
  HW_DETAILS_REQUEST,
  HW_DETAILS_SUCCESS,
  HW_DETAILS_FAIL,
  HW_DETAILS_RESET,
  HW_DELETE_SUCCESS,
  HW_DELETE_REQUEST,
  HW_DELETE_FAIL,
  HW_UPDATE_REQUEST,
  HW_UPDATE_SUCCESS,
  HW_UPDATE_FAIL,
  HW_UPDATE_RESET,
  ADD_QUESTION_TO_HW_REQUEST,
  ADD_QUESTION_TO_HW_SUCCESS,
  ADD_QUESTION_TO_HW_FAIL,
  ADD_QUESTION_TO_HW_RESET,
  DELETE_QUESTION_TO_HW_REQUEST,
  DELETE_QUESTION_TO_HW_SUCCESS,
  DELETE_QUESTION_TO_HW_FAIL,
  DELETE_QUESTION_TO_HW_RESET,
  HW_DETAILS_ADD_CLASS_REQUEST,
  HW_DETAILS_ADD_CLASS_SUCCESS,
  HW_DETAILS_ADD_CLASS_FAIL,
  HW_DETAILS_ADD_CLASS_RESET,
} from '../constants/hwConstants';

// 已重构
export const createHW = () => async (dispatch, getState) => {
  try {
    dispatch ({
      type: HW_CREATE_REQUEST,
    });


    const {result} = await axios.post (`/teacher/createHomeWork`, {
      language: window.localStorage.getItem ('lang') || 'en',
    });

    dispatch ({
      type: HW_CREATE_SUCCESS,
      payload: result,
    });
  } catch (error) {
    dispatch ({
      type: HW_CREATE_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const listTeacherHWs = (name) => async (dispatch, getState) => {
  try {
    dispatch ({
      type: HW_LIST_FOR_TEACHER_REQUEST,
    });

    const {userLogin: {userInfo}} = getState ();

    const {result} = await axios.post (
      `/teacher/getHWByTeacher`,
      {
        id: userInfo._id,
        name,
        language: window.localStorage.getItem ('lang') || 'en',
      },
    );

    dispatch ({
      type: HW_LIST_FOR_TEACHER_SUCCESS,
      payload: result.list,
    });
  } catch (error) {
    dispatch ({
      type: HW_LIST_FOR_TEACHER_FAIL,
      payload: error.message,
    });
  }
};
// 已重构
export const getHwDetails = id => async (dispatch, getState) => {
  try {
    dispatch ({type: HW_DETAILS_REQUEST});

    const {result} = await axios.post (`/user/getHWById`, {id});

    dispatch ({
      type: HW_DETAILS_SUCCESS,
      payload: result,
    });
  } catch (error) {
    dispatch ({
      type: HW_DETAILS_FAIL,
      payload: error.msg
    });
  }
};
// 已重构
export const updateHW = hw => async (dispatch, getState) => {
  try {
    dispatch ({
      type: HW_UPDATE_REQUEST,
    });

    const {result} = await axios.post (`/teacher/updateHW`, hw);

    dispatch ({
      type: HW_UPDATE_SUCCESS,
      payload: result,
    });
    dispatch ({type: HW_LIST_FOR_TEACHER_SUCCESS, payload: result});
  } catch (error) {
    dispatch ({
      type: HW_UPDATE_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const deleteHW = id => async (dispatch, getState) => {
  try {
    dispatch ({
      type: HW_DELETE_REQUEST,
    });

    await axios.post (`/teacher/deleteHW`, {
      id,
    });

    dispatch ({
      type: HW_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch ({
      type: HW_DELETE_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const addQToHW = (hwID, question) => async (dispatch, getState) => {
  try {
    dispatch ({
      type: ADD_QUESTION_TO_HW_REQUEST,
    });

    // console.log ('in addQToHW', question);
    const {result} = await axios.post (
      `/teacher/addQToHW`,
      {
        ...question,
        id: hwID,
      }
    );

    dispatch ({
      type: ADD_QUESTION_TO_HW_SUCCESS,
    });
    //  dispatch ({type: HW_LIST_FOR_TEACHER_SUCCESS, payload: data});
  } catch (error) {
    dispatch ({
      type: ADD_QUESTION_TO_HW_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const deleteQFromHW = (hwID, QLID) => async (dispatch, getState) => {
  try {
    dispatch ({
      type: DELETE_QUESTION_TO_HW_REQUEST,
    });

    // console.log ('in deleteQFromHW', QLID);
    await axios.post (`/teacher/deleteQFromHW`, {
      QLID,
      id: hwID,
    });

    dispatch ({
      type: DELETE_QUESTION_TO_HW_SUCCESS,
    });
    //  dispatch ({type: HW_LIST_FOR_TEACHER_SUCCESS, payload: data});
  } catch (error) {
    dispatch ({
      type: DELETE_QUESTION_TO_HW_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const getHwDetailsAddClass = id => async (dispatch, getState) => {
  try {
    dispatch ({type: HW_DETAILS_ADD_CLASS_REQUEST});

    const {result} = await axios.post (`/user/getHWById`, {id});

    dispatch ({
      type: HW_DETAILS_ADD_CLASS_SUCCESS,
      payload: result,
    });
  } catch (error) {
    dispatch ({
      type: HW_DETAILS_ADD_CLASS_FAIL,
      payload: error.msg,
    });
  }
};
