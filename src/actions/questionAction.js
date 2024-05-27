import axios from '../utils/axios';

import {
  QUESTION_LIST_FOR_TEACHER_REQUEST,
  QUESTION_LIST_FOR_TEACHER_SUCCESS,
  QUESTION_LIST_FOR_TEACHER_FAIL,
  QUESTION_LIST_FOR_TEACHER_RESET,
  QUESTION_CREATE_REQUEST,
  QUESTION_CREATE_SUCCESS,
  QUESTION_CREATE_FAIL,
  QUESTION_CREATE_RESET,
  QUESTION_DETAILS_REQUEST,
  QUESTION_DETAILS_SUCCESS,
  QUESTION_DETAILS_FAIL,
  QUESTION_DELETE_SUCCESS,
  QUESTION_DELETE_REQUEST,
  QUESTION_DELETE_FAIL,
  QUESTION_UPDATE_REQUEST,
  QUESTION_UPDATE_SUCCESS,
  QUESTION_UPDATE_FAIL,
  QUESTION_UPDATE_RESET,
} from '../constants/questionConstants';

// 已重构
export const createQuestions = () => async (dispatch, getState) => {
  try {
    dispatch ({
      type: QUESTION_CREATE_REQUEST,
    });

    const {result} = await axios.post (`/teacher/createQuestion`, {
      language: window.localStorage.getItem ('lang') || 'en',
    });

    dispatch ({
      type: QUESTION_CREATE_SUCCESS,
      payload: result,
    });
  } catch (error) {
    dispatch ({
      type: QUESTION_CREATE_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const listTeacherQuestions = (name) => async (dispatch, getState) => {
  try {
    dispatch ({
      type: QUESTION_LIST_FOR_TEACHER_REQUEST,
    });

    const {userLogin: {userInfo}} = getState ();

    const {result} = await axios.post (
      `/teacher/getQuestionsByTeacher`,
      {
        id: userInfo._id, 
        name,
        language: window.localStorage.getItem ('lang') || 'en',
      },
    );

    dispatch ({
      type: QUESTION_LIST_FOR_TEACHER_SUCCESS,
      payload: result.list,
    });
  } catch (error) {
    dispatch ({
      type: QUESTION_LIST_FOR_TEACHER_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const deleteQuestion = id => async (dispatch, getState) => {
  try {
    dispatch ({
      type: QUESTION_DELETE_REQUEST,
    });

    await axios.post (`/teacher/deleteQuestion`, {id});

    dispatch ({
      type: QUESTION_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch ({
      type: QUESTION_DELETE_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const updateQuestion = q => async (dispatch, getState) => {
  try {
    dispatch ({
      type: QUESTION_UPDATE_REQUEST,
    });

    const {result} = await axios.put (`/teacher/updateQuestion`, q);

    dispatch ({
      type: QUESTION_UPDATE_SUCCESS,
      payload: result,
    });
    dispatch ({type: QUESTION_LIST_FOR_TEACHER_SUCCESS, payload: result});
  } catch (error) {
    dispatch ({
      type: QUESTION_UPDATE_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const questionDetails = id => async (dispatch, getState) => {
  try {
    dispatch ({type: QUESTION_DETAILS_REQUEST});

    const {result} = await axios.post (`/teacher/getQuestionById`, {id});

    dispatch ({
      type: QUESTION_DETAILS_SUCCESS,
      payload: result,
    });
  } catch (error) {
    dispatch ({
      type: QUESTION_DETAILS_FAIL,
      payload: error.msg,
    });
  }
};
