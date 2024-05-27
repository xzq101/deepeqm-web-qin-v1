import {
  MY_HW_IN_CLASS_REQUEST,
  MY_HW_IN_CLASS_SUCCESS,
  MY_HW_IN_CLASS_FAIL,
  MY_HW_IN_CLASS_RESET,
} from '../constants/startLearningConstants';

export const myHWListInClassReducer = (state = {hws: []}, action) => {
  switch (action.type) {
    case MY_HW_IN_CLASS_REQUEST:
      return {loading: true};
    case MY_HW_IN_CLASS_SUCCESS:
      return {loading: false, success: true, classContent: action.payload};
    case MY_HW_IN_CLASS_FAIL:
      return {loading: false, error: action.payload};
    case MY_HW_IN_CLASS_RESET:
      return {hw: {}};
    default:
      return state;
  }
};
