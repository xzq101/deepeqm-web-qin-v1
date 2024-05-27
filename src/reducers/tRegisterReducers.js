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

export const myClassListReducer = (state = {myClasses: []}, action) => {
  switch (action.type) {
    case MY_CLASS_LIST_REQUEST:
      return {
        loading: true,
      };
    case MY_CLASS_LIST_SUCCESS:
      return {
        loading: false,
        myClasses: action.payload,
      };
    case MY_CLASS_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case MY_CLASS_LIST_RESET:
      return {myClasses: []};
    default:
      return state;
  }
};

export const registerCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case REGISTER_CREATE_REQUEST:
      return {
        loading: true,
      };
    case REGISTER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        register: action.payload,
      };
    case REGISTER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case REGISTER_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const studentListInClassReducer = (state = {students: []}, action) => {
  switch (action.type) {
    case STUDENT_LIST_IN_CLASS_REQUEST:
      return {
        loading: true,
      };
    case STUDENT_LIST_IN_CLASS_SUCCESS:
      return {
        loading: false,
        success: true,
        students: action.payload,
      };
    case STUDENT_LIST_IN_CLASS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case STUDENT_LIST_IN_CLASS_RESET:
      return {};
    default:
      return state;
  }
};

export const removeStudentFromClassReducer = (state = {}, action) => {
  switch (action.type) {
    case REMOVE_STUDENT_FROM_CLASS_REQUEST:
      return {
        loading: true,
      };
    case REMOVE_STUDENT_FROM_CLASS_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case REMOVE_STUDENT_FROM_CLASS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case REMOVE_STUDENT_FROM_CLASS_RESET:
      return {};
    default:
      return state;
  }
};
