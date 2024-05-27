// import axios from 'axios';
import axios from '../utils/axios';

import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_DETAILS_RESET,
  USER_LIST_FAIL,
  USER_LIST_SUCCESS,
  USER_LIST_REQUEST,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_FAIL,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_REQUEST,
  FIND_USER_EMAIL_REQUEST,
  FIND_USER_EMAIL_SUCCESS,
  FIND_USER_EMAIL_FAIL,
  FIND_USER_EMAIL_RESET,
} from '../constants/userConstants';

// 已重构
export const login = (email, password) => async dispatch => {
  try {
    dispatch ({
      type: USER_LOGIN_REQUEST,
    });


    const {result} = await axios.post (
      '/login/authUser',
      {email, password},
    );

    dispatch ({
      type: USER_LOGIN_SUCCESS,
      payload: result,
    });
    localStorage.setItem ('userInfo', JSON.stringify (result));
    document.location.href = '/profile';
  } catch (error) {
    dispatch ({
      type: USER_LOGIN_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

export const logout = () => dispatch => {
  localStorage.removeItem ('userInfo');
  //localStorage.removeItem('cartItems')
  //localStorage.removeItem('shippingAddress')
  // localStorage.removeItem('paymentMethod')
  dispatch ({type: USER_LOGOUT});
  //dispatch({ type: USER_DETAILS_RESET })
  //dispatch({ type: ORDER_LIST_MY_RESET })
  // dispatch({ type: USER_LIST_RESET })
  document.location.href = '/login';
};

// 已重构
export const register = ({
  name,
  email,
  password,
  role,
  dependent,
  code,
  phone,
  address,
  city,
  state,
  country,
  zip,
  school,
  gradeInSchoolYear,
}) => async dispatch => {
  try {
    dispatch ({
      type: USER_REGISTER_REQUEST,
    });

    const {result} = await axios.post (
      '/login/registerUser',
      {
        name,
        email,
        password,
        role,
        dependent,
        code: Number(code),
        phone,
        address,
        city,
        state,
        country,
        zip,
        school,
        gradeInSchoolYear,
      },
    );

    dispatch ({
      type: USER_REGISTER_SUCCESS,
      payload: result,
    });

    dispatch ({
      type: USER_LOGIN_SUCCESS,
      payload: result,
    });
    localStorage.setItem ('userInfo', JSON.stringify (result));
  } catch (error) {
    dispatch ({
      type: USER_REGISTER_FAIL,
      payload: error.msg,
    });
  }
};

// 已重构
export const getUserDetails = id => async (dispatch, getState) => {
  try {
    dispatch ({
      type: USER_DETAILS_REQUEST,
    });

    const {result} = await axios.get (`/user/getUserProfile`);

    dispatch ({
      type: USER_DETAILS_SUCCESS,
      payload: result,
    });
  } catch (error) {
    dispatch ({
      type: USER_DETAILS_FAIL,
      payload: error.msg,
    });
  }
};

export const getUserDetailsById = id => async (dispatch, getState) => {
  try {
    dispatch ({
      type: USER_DETAILS_REQUEST,
    });

    const {result} = await axios.get (`/admin/getUserById`, {
      params: {
        id
      }
    });

    dispatch ({
      type: USER_DETAILS_SUCCESS,
      payload: result,
    });
  } catch (error) {
    dispatch ({
      type: USER_DETAILS_FAIL,
      payload: error.msg,
    });
  }
}

// 已重构
export const updateUserProfile = user => async (dispatch, getState) => {
  try {
    dispatch ({
      type: USER_UPDATE_PROFILE_REQUEST,
    });

    const {result} = await axios.post (`/user/updateUserProfile`, user);

    // dispatch ({
    //   type: USER_UPDATE_PROFILE_SUCCESS,
    //   payload: result,
    // });
    // dispatch ({
    //   type: USER_LOGIN_SUCCESS,
    //   payload: result,
    // });

    localStorage.setItem ('userInfo', JSON.stringify (result));
    // 刷新页面
    document.location.reload ();
  } catch (error) {
    dispatch ({
      type: USER_UPDATE_PROFILE_FAIL,
      payload: error.msg,
    });
  }
};

// 已重构
export const listUsers = (keyword) => async (dispatch, getState) => {
  try {
    dispatch ({
      type: USER_LIST_REQUEST,
    });
    const {result} = await axios.get (`/admin/getUsers`, {
      params: {
        keyword
      }
    });

    dispatch ({
      type: USER_LIST_SUCCESS,
      payload: result.list,
    });
  } catch (error) {
    dispatch ({
      type: USER_LIST_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const deleteUser = id => async (dispatch, getState) => {
  try {
    dispatch ({
      type: USER_DELETE_REQUEST,
    });

    await axios.post (`/admin/deleteUser`, {
      id,
    });

    dispatch ({type: USER_DELETE_SUCCESS});
  } catch (error) {
    dispatch ({
      type: USER_DELETE_FAIL,
      payload: error.message,
    });
  }
};

// 已重构
export const updateUser = user => async (dispatch, getState) => {
  try {
    dispatch ({
      type: USER_UPDATE_REQUEST,
    });


    const {result} = await axios.post (`/admin/updateUser`, user);

    dispatch ({type: USER_UPDATE_SUCCESS});

    dispatch ({type: USER_DETAILS_SUCCESS, payload: result});

    dispatch ({type: USER_DETAILS_RESET});
  } catch (error) {
    dispatch ({
      type: USER_UPDATE_FAIL,
      payload: error.msg,
    });
  }
};
// 已重构
export const getUserByEmail = email => async (dispatch, getState) => {
  try {
    dispatch ({
      type: FIND_USER_EMAIL_REQUEST,
    });

    const {result} = await axios.post ('/teacher/getUserByEmail', {email});

    dispatch ({
      type: FIND_USER_EMAIL_SUCCESS,
      payload: result,
    });
  } catch (error) {
    dispatch ({
      type: FIND_USER_EMAIL_FAIL,
      payload: error.msg
    });
  }
};
