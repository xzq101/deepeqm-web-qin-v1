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

export const hwCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case HW_CREATE_REQUEST:
      return {loading: true};
    case HW_CREATE_SUCCESS:
      return {loading: false, success: true, hw: action.payload};
    case HW_CREATE_FAIL:
      return {loading: false, error: action.payload};
    case HW_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const hwListForTeacherReducer = (state = {hws: []}, action) => {
  switch (action.type) {
    case HW_LIST_FOR_TEACHER_REQUEST:
      return {
        loading: true,
      };
    case HW_LIST_FOR_TEACHER_SUCCESS:
      return {
        loading: false,
        hws: action.payload,
      };
    case HW_LIST_FOR_TEACHER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case HW_LIST_FOR_TEACHER_RESET:
      return {hws: []};
    default:
      return state;
  }
};

export const hwDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case HW_DELETE_REQUEST:
      return {loading: true};
    case HW_DELETE_SUCCESS:
      return {loading: false, success: true};
    case HW_DELETE_FAIL:
      return {loading: false, error: action.payload};
    default:
      return state;
  }
};

export const hwUpdateReducer = (state = {hw: {}}, action) => {
  switch (action.type) {
    case HW_UPDATE_REQUEST:
      return {loading: true};
    case HW_UPDATE_SUCCESS:
      return {loading: false, success: true, hw: action.payload};
    case HW_UPDATE_FAIL:
      return {loading: false, error: action.payload};
    case HW_UPDATE_RESET:
      return {hw: {}};
    default:
      return state;
  }
};

export const hwDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case HW_DETAILS_REQUEST:
      return {...state, loading: true};
    case HW_DETAILS_SUCCESS:
      return {loading: false, hw: action.payload};
    case HW_DETAILS_FAIL:
      return {loading: false, error: action.payload};
    case HW_DETAILS_RESET:
      return {};
    default:
      return state;
  }
};

export const hwAddQReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_QUESTION_TO_HW_REQUEST:
      return {loading: true};
    case ADD_QUESTION_TO_HW_SUCCESS:
      return {loading: false, success: true};
    case ADD_QUESTION_TO_HW_FAIL:
      return {loading: false, error: action.payload};
    case ADD_QUESTION_TO_HW_RESET:
      return {};
    default:
      return state;
  }
};

export const hwDeleteQReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_QUESTION_TO_HW_REQUEST:
      return {loading: true};
    case DELETE_QUESTION_TO_HW_SUCCESS:
      return {loading: false, success: true};
    case DELETE_QUESTION_TO_HW_FAIL:
      return {loading: false, error: action.payload};
    case DELETE_QUESTION_TO_HW_RESET:
      return {};
    default:
      return state;
  }
};

export const hwDetailsAddClassReducer = (state = {}, action) => {
  switch (action.type) {
    case HW_DETAILS_ADD_CLASS_REQUEST:
      return {...state, loading: true};
    case HW_DETAILS_ADD_CLASS_SUCCESS:
      return {loading: false, hw: action.payload};
    case HW_DETAILS_ADD_CLASS_FAIL:
      return {loading: false, error: action.payload};
    case HW_DETAILS_ADD_CLASS_RESET:
      return {};
    default:
      return state;
  }
};
