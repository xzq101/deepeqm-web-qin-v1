import {
  CLASS_LIST_FOR_TEACHER_REQUEST,
  CLASS_LIST_FOR_TEACHER_SUCCESS,
  CLASS_LIST_FOR_TEACHER_FAIL,
  CLASS_LIST_FOR_TEACHER_RESET,
  CLASS_CREATE_REQUEST,
  CLASS_CREATE_SUCCESS,
  CLASS_CREATE_FAIL,
  CLASS_CREATE_RESET,
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

export const classCreateByTeachReducer = (state = {}, action) => {
  switch (action.type) {
    case CLASS_CREATE_REQUEST:
      return {loading: true};
    case CLASS_CREATE_SUCCESS:
      return {loading: false, success: true, tclass: action.payload};
    case CLASS_CREATE_FAIL:
      return {loading: false, error: action.payload};
    case CLASS_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const classListForTeacherReducer = (state = {classes: []}, action) => {
  switch (action.type) {
    case CLASS_LIST_FOR_TEACHER_REQUEST:
      return {
        loading: true,
      };
    case CLASS_LIST_FOR_TEACHER_SUCCESS:
      return {
        loading: false,
        classes: action.payload,
      };
    case CLASS_LIST_FOR_TEACHER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLASS_LIST_FOR_TEACHER_RESET:
      return {classes: []};
    default:
      return state;
  }
};

export const classDeleteByTeachReducer = (state = {}, action) => {
  switch (action.type) {
    case CLASS_DELETE_REQUEST:
      return {loading: true};
    case CLASS_DELETE_SUCCESS:
      return {loading: false, success: true};
    case CLASS_DELETE_FAIL:
      return {loading: false, error: action.payload};
    default:
      return state;
  }
};

export const classUpdateByTeachReducer = (state = {tClass: {}}, action) => {
  switch (action.type) {
    case CLASS_UPDATE_REQUEST:
      return {loading: true};
    case CLASS_UPDATE_SUCCESS:
      return {loading: false, success: true, tClass: action.payload};
    case CLASS_UPDATE_FAIL:
      return {loading: false, error: action.payload};
    case CLASS_UPDATE_RESET:
      return {tClass: {}};
    default:
      return state;
  }
};

export const ClassDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case CLASS_DETAILS_REQUEST:
      return {...state, loading: true};
    case CLASS_DETAILS_SUCCESS:
      return {loading: false, tClass: action.payload};
    case CLASS_DETAILS_FAIL:
      return {loading: false, error: action.payload};
    default:
      return state;
  }
};

export const classAddHWReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_HW_TO_CLASS_REQUEST:
      return {loading: true};
    case ADD_HW_TO_CLASS_SUCCESS:
      return {loading: false, success: true};
    case ADD_HW_TO_CLASS_FAIL:
      return {loading: false, error: action.payload};
    case ADD_HW_TO_CLASS_RESET:
      return {};
    default:
      return state;
  }
};

export const classDeleteHWReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_HW_FROM_CLASS_REQUEST:
      return {loading: true};
    case DELETE_HW_FROM_CLASS_SUCCESS:
      return {loading: false, success: true};
    case DELETE_HW_FROM_CLASS_FAIL:
      return {loading: false, error: action.payload};
    case DELETE_HW_FROM_CLASS_RESET:
      return {};
    default:
      return state;
  }
};
