import {
  MY_HW_IN_CLASS_REQUEST,
  MY_HW_IN_CLASS_SUCCESS,
  MY_HW_IN_CLASS_FAIL,
  MY_HW_IN_CLASS_RESET,
} from '../constants/startLearningConstants';

import axios from '../utils/axios';

// 已重构
export const fetchHWList = (rID, userInfo) => async (dispatch, getState) => {
  try {
    dispatch ({type: MY_HW_IN_CLASS_REQUEST});

    const {result} = await axios.post (`/user/getClassesContent`, {
      id: rID,
      ...userInfo
    });

    dispatch ({
      type: MY_HW_IN_CLASS_SUCCESS,
      payload: result,
    });
  } catch (error) {
    dispatch ({
      type: MY_HW_IN_CLASS_FAIL,
      payload: error.msg,
    });
  }
};
