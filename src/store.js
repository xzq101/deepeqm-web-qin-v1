import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
  findUserByEmailReducer,
} from './reducers/userReducers';

import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer,
} from './reducers/productReducers';

import {
  classCreateByTeachReducer,
  classListForTeacherReducer,
  classDeleteByTeachReducer,
  classUpdateByTeachReducer,
  ClassDetailsReducer,
  classAddHWReducer,
  classDeleteHWReducer,
} from './reducers/tClassReducers';

import {
  questionCreateReducer,
  questionListForTeacherReducer,
  questionDeleteReducer,
  questionUpdateReducer,
  questionDetailsReducer,
} from './reducers/questionReducers';

import {
  registerCreateReducer,
  studentListInClassReducer,
  removeStudentFromClassReducer,
  myClassListReducer,
} from './reducers/tRegisterReducers';

import {
  hwCreateReducer,
  hwListForTeacherReducer,
  hwDeleteReducer,
  hwUpdateReducer,
  hwDetailsReducer,
  hwAddQReducer,
  hwDeleteQReducer,
  hwDetailsAddClassReducer,
} from './reducers/hwReducers';

import {myHWListInClassReducer} from './reducers/startLearningReducers';

const reducer = combineReducers ({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productReviewCreate: productReviewCreateReducer,
  productTopRated: productTopRatedReducer,
  classCreateByT: classCreateByTeachReducer,
  classListForT: classListForTeacherReducer,
  classDeleteByT: classDeleteByTeachReducer,
  classUpdateByT: classUpdateByTeachReducer,
  classDetails: ClassDetailsReducer,
  findUserByEmail: findUserByEmailReducer,
  registerCreate: registerCreateReducer,
  studentListInClass: studentListInClassReducer,
  removeStudentFromClass: removeStudentFromClassReducer,
  myClassList: myClassListReducer,
  questionCreate: questionCreateReducer,
  questionListForTeacher: questionListForTeacherReducer,
  questionDelete: questionDeleteReducer,
  questionUpdate: questionUpdateReducer,
  questionDetails: questionDetailsReducer,
  hwCreate: hwCreateReducer,
  hwListForTeacher: hwListForTeacherReducer,
  hwDelete: hwDeleteReducer,
  hwUpdate: hwUpdateReducer,
  hwDetails: hwDetailsReducer,
  hwAddQ: hwAddQReducer,
  hwDeleteQ: hwDeleteQReducer,
  hwDetailsAddClass: hwDetailsAddClassReducer,
  classAddHW: classAddHWReducer,
  classDeleteHW: classDeleteHWReducer,
  myHWListInClass: myHWListInClassReducer,
});

const userInfoFromStorage = localStorage.getItem ('userInfo')
  ? JSON.parse (localStorage.getItem ('userInfo'))
  : null;

const initialState = {userLogin: {userInfo: userInfoFromStorage}};

const middleware = [thunk];

const store = createStore (
  reducer,
  initialState,
  composeWithDevTools (applyMiddleware (...middleware))
);

export default store;
