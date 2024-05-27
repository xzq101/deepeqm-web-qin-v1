// import axios from 'axios';
import axios from '../utils/axios';

import {
  REGISTER_CREATE_REQUEST,
  REGISTER_CREATE_SUCCESS,
  REGISTER_CREATE_FAIL,
  REGISTER_CREATE_RESET,
  STUDENT_LIST_IN_CLASS_REQUEST,
  STUDENT_LIST_IN_CLASS_SUCCESS,
  STUDENT_LIST_IN_CLASS_FAIL,
  STUDENT_LIST_IN_CLASS_RESET,
  REMOVE_STUDENT_FROM_CLASS_REQUEST,
  REMOVE_STUDENT_FROM_CLASS_SUCCESS,
  REMOVE_STUDENT_FROM_CLASS_FAIL,
  REMOVE_STUDENT_FROM_CLASS_RESET,
  MY_CLASS_LIST_REQUEST,
  MY_CLASS_LIST_SUCCESS,
  MY_CLASS_LIST_FAIL,
  MY_CLASS_LIST_RESET,
} from '../constants/registerConstants';

// 已重构
export const createRegisterByTeacher = registerInfo => async (
  dispatch,
  getState
) => {
  try {
    dispatch ({
      type: REGISTER_CREATE_REQUEST,
    });

    const {result} = await axios.post (`/teacher/addStudentToClass`, registerInfo);

    dispatch ({
      type: REGISTER_CREATE_SUCCESS,
      payload: result,
    });
  } catch (error) {
    dispatch ({
      type: REGISTER_CREATE_FAIL,
      payload: error.msg,
    });
  }
};

// 已重构
export const listStudentsInClass = classID => async (dispatch, getState) => {
  try {
    dispatch ({
      type: STUDENT_LIST_IN_CLASS_REQUEST,
    });


    const {result} = await axios.post (
      `/teacher/studentList`,
      {classID},
    );

    dispatch ({
      type: STUDENT_LIST_IN_CLASS_SUCCESS,
      payload: result.list,
    });
  } catch (error) {
    dispatch ({
      type: STUDENT_LIST_IN_CLASS_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const removeStudentFromClass = (studentID, classID) => async (
  dispatch,
  getState
) => {
  try {
    dispatch ({
      type: REMOVE_STUDENT_FROM_CLASS_REQUEST,
    });
    await axios.post (`/teacher/removeStudentFromClass`, {
      studentID,
      classID,
    });
    dispatch ({type: REMOVE_STUDENT_FROM_CLASS_SUCCESS});
  } catch (error) {
    dispatch ({
      type: REMOVE_STUDENT_FROM_CLASS_FAIL,
      payload: error.msg,
    });
  }
};

// 已重构
export const listMyClasses = () => async (dispatch, getState) => {
  try {
    dispatch ({
      type: MY_CLASS_LIST_REQUEST,
    });

    const {result} = await axios.get (`/user/getMyClasses`);
    dispatch ({
      type: MY_CLASS_LIST_SUCCESS,
      payload: result.list,
    });
  } catch (error) {
    dispatch ({
      type: MY_CLASS_LIST_FAIL,
      payload: error.msg,
    });
  }
};
