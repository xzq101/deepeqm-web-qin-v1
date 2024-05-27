import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { SnackbarProvider } from "notistack";
import {useDispatch, useSelector} from 'react-redux';
import getTitleByPath from './utils/getTitleByPath';
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import "./bootstrap.min.css";
import '@wangeditor/editor/dist/css/style.css';
// User Screen
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import UserListScreen from "./screens/UserListScreen";
// import AddClassCategory from "./screens/AddClassCategory";
import UserEditScreen from "./screens/UserEditScreen";
import MyClassesView from "./screens/MyClassesView";
// product Screen
// import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
//Teacher class View
import TeachClassListView from "./screens/TeachClassListView";
import TeachClassEditView from "./screens/TeachClassEditView";
import TeachClassStudentsView from "./screens/TeachClassStudentsView";

import TeachQuestionsListView from "./screens/TeachQuestionsListView";
import TeachQuestionEditView from "./screens/TeachQuestionEditView";

import TeachHWListView from "./screens/TeachHWListView";
import TeachHWEditView from "./screens/TeachHWEditView";

import TeachAddContentToClassView from "./screens/TeachAddContentToClassView";
import ParentStudentsListView from "./screens/ParentStudentsListView";

import MyClassContentView from "./screens/MyClassContentView";

import SimView from "./components/SimView";
import ClassDetailView from "./screens/ClassDetailView";
import VerifyScreen from "./screens/VerifyScreen";

import StudentExerciseList from "./screens/StudentExerciseList";
import StudentExerciseEdit from "./screens/StudentExerciseEdit";
import TeacherExerciseView from "./screens/TeacherExerciseView";
import StudentExerciseDetail from "./screens/StudentExerciseDetail";
import ParentStudentsExerciseList from "./screens/ParentStudentsExerciseList";

import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import AuditClassScreen from "./screens/AuditClassScreen";
import EmailRecordScreen from "./screens/EmailRecordScreen";
import SendEmailScreen from "./screens/SendEmailScreen";
import MyHomeworkView from "./screens/MyHomeworkView";
import CorrectionExerciseScreen from "./screens/CorrectionExerciseScreen";

import AdminLibrary from "./screens/AdminLibrary";
import TeacherLibrary from "./screens/TeacherLibrary";
import StudentResources from "./screens/StudentResources";
import AdminLibraryQuestion from "./screens/AdminLibraryQuestion";
import ClassRegister from "./screens/ClassRegister";

import RegisterFamilyScreen from "./screens/RegisterFamilyScreen";

import axios from 'axios';

function useDocumentTitle(title) {
    useEffect(() => {
      document.title = title;
    }, [title]);
}

const LocationContainer = ({ children }) => {
    const currentLocation = useLocation();
    useDocumentTitle(getTitleByPath(currentLocation.pathname));

    return <>{children}</>
}

const App = () => {

    const dispatch = useDispatch();

    const getUserInfo = () => {
        const userInfo = localStorage.getItem("userInfo");
        if (!userInfo) return;
        const { token } = JSON.parse(userInfo);
        axios.get(`/user/getUserInfo`, {
            baseURL: process.env.NODE_ENV === 'development' ? "/" : "/api/",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                const { result } = res.data;
                const params = {
                    ...result,
                    token,
                }
                dispatch({ type: 'USER_LOGIN_SUCCESS', payload: params });
                window.localStorage.setItem('userInfo', JSON.stringify(params));
            })
            .catch(err => {
                console.log(err);
            })
    };

    useEffect(() => {
        getUserInfo()
    }, []); // eslint-disable-line

    return (
        <SnackbarProvider>
            <Router>
                <LocationContainer>
                    <Header />
                    <main className="py-3">
                        <Container>
                            <Route path="/" component={HomeScreen} exact />

                            <Route path="/login" component={LoginScreen} />
                            {/* <Route path="/register" component={RegisterScreen} /> */}
                            <Route path="/register" component={RegisterFamilyScreen} />
                            <Route path="/profile" component={ProfileScreen} />
                            <Route path="/myclasses" component={MyClassesView} />

                            <Route path="/class/:id" component={ClassDetailView} />
                            <Route
                                path="/product/:id"
                                component={ProductDetailScreen}
                            />

                            <Route path="/admin/userlist" component={UserListScreen} />
                            {/* <Route
                            path="/admin/ClassCategory"
                            component={AddClassCategory}
                        /> */}
                            <Route
                                path="/admin/user/:id/edit"
                                component={UserEditScreen}
                            />

                            {/* <Route
                            path="/admin/productlist"
                            component={ProductListScreen}
                        /> */}
                            <Route
                                path="/admin/product/:id/edit"
                                component={ProductEditScreen}
                            />

                            <Route
                                path="/teach/classlist"
                                component={TeachClassListView}
                            />
                            <Route
                                path="/teach/class/:id/edit"
                                component={TeachClassEditView}
                            />

                            <Route
                                path="/teach/class/:id/addStudent"
                                component={TeachClassStudentsView}
                            />

                            <Route
                                path="/teach/class/:id/addContent"
                                component={TeachAddContentToClassView}
                            />

                            <Route
                                path="/teach/questionlist"
                                component={TeachQuestionsListView}
                            />
                            <Route
                                path="/teach/question/:id/edit"
                                component={TeachQuestionEditView}
                            />

                            <Route path="/teach/hwlist" component={TeachHWListView} />
                            <Route
                                path="/teach/hw/:id/edit"
                                component={TeachHWEditView}
                            />
                            <Route
                                path="/parent/studentlist"
                                component={ParentStudentsListView}
                            />

                            <Route
                                path="/classroom/:id"
                                component={MyClassContentView}
                            />

                            <Route path="/simview" component={SimView} />

                            <Route path="/verify" component={VerifyScreen} />

                            <Route path="/student/exerciseList" component={StudentExerciseList} />
                            <Route path="/student/exerciseEdit/:id" component={StudentExerciseEdit} />
                            <Route path="/teacher/exercise/:classId/:id" component={TeacherExerciseView} />
                            <Route path="/student/exercise/:id" component={StudentExerciseDetail} />
                            <Route path="/parent/student/exercise/:studentId/:classId" component={ParentStudentsExerciseList} />

                            <Route path="/resetPassword" component={ResetPasswordScreen} />
                            <Route path="/admin/auditClass" component={AuditClassScreen} />
                            <Route path="/admin/emailList" component={EmailRecordScreen} />
                            <Route path="/admin/sendEmail" component={SendEmailScreen} />
                            <Route path="/myHomework/:id" component={MyHomeworkView} />
                            <Route path="/teacher/correctionExercise/:classId/:homeworkId" component={CorrectionExerciseScreen} />

                            <Route path="/admin/library" component={AdminLibrary} />
                            <Route path="/admin/libraryQuestion" component={AdminLibraryQuestion} />
                            <Route path="/teacher/library" component={TeacherLibrary} />

                            <Route path="/classRegister/:id" component={ClassRegister} />
                        </Container>
                        <Route path="/student/resources" component={StudentResources} />
                    </main>
                    <Footer />
                </LocationContainer>
            </Router>
        </SnackbarProvider>
    );
};

export default App;
