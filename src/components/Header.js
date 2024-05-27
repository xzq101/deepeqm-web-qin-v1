import React, { useState } from "react";
import "./Header.css";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import logos from "./logo192.png";
import { LinkContainer } from "react-router-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";

const Header = () => {
    const dispatch = useDispatch();
    const lang = window.localStorage.getItem("lang") || "en";

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    // console.log ('role', userInfo.role);

    const logoutHandler = () => {
        dispatch(logout());
    };
    const changeLanguage = () => {
        window.localStorage.setItem("lang", lang === "en" ? "zh" : "en");
        window.location.reload();
    }

    return (
        <header>
            <Navbar className="no-border " bg="light" expand="lg">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand className="navbar-brand ">
                            <img
                                alt="DeepEqm"
                                src={logos}
                                className="logo"
                            />
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto nav-font-size-2">
                            <Nav.Link href="/">Home</Nav.Link>

                            {/* <NavDropdown
                                title="Physics"
                                id="basic-nav-dropdown"
                            >
                                <NavDropdown.Item
                                    href="/#t_pyclass"
                                    className="nav-font-size-2"
                                >
                                    Physics Courses
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    href="#action/3.2"
                                    className="nav-font-size-2"
                                >
                                    Path to USAPHO
                                </NavDropdown.Item>

                                <LinkContainer to="/simview">
                                    <NavDropdown.Item className="nav-font-size-2">
                                        Simulator
                                    </NavDropdown.Item>
                                </LinkContainer>

                                <NavDropdown.Item href="#action/3.4" />
                            </NavDropdown> */}
                            {/* <NavDropdown title="Math" id="basic-nav-dropdown">
                                <NavDropdown.Item
                                    href="/#t_mathclass"
                                    className="nav-font-size-2"
                                >
                                    Math Courses
                                </NavDropdown.Item>
                            </NavDropdown> */}
                            <NavDropdown title="Courses" id="basic-nav-dropdown">
                                <NavDropdown.Item
                                    href="/#Physics"
                                    className="nav-font-size-2"
                                >
                                    Physics Courses
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    href="/#Math"
                                    className="nav-font-size-2"
                                >
                                    Math Courses
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>

                        {userInfo ? (
                            <Nav className="ml-auto nav-font-size">
                                <NavDropdown
                                    title={userInfo.name}
                                    id="username"
                                    className="nav-font-size-2"
                                >
                                    <LinkContainer
                                        className="nav-font-size-2"
                                        to="/profile"
                                    >
                                        <NavDropdown.Item>
                                            Profile
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    {
                                        userInfo.role === "Student" && (
                                            <React.Fragment>
                                                <LinkContainer
                                                    className="nav-font-size-2"
                                                    to="/myclasses"
                                                >
                                                    <NavDropdown.Item>
                                                        My Classes
                                                    </NavDropdown.Item>
                                                </LinkContainer>
                                                {
                                                    userInfo.sRegister && (
                                                        <LinkContainer
                                                            className="nav-font-size-2"
                                                            to="/student/resources">
                                                            <NavDropdown.Item>
                                                                Resources
                                                            </NavDropdown.Item>
                                                        </LinkContainer>
                                                    )
                                                }
                                            </React.Fragment>
                                        )
                                    }
                                    {
                                        userInfo.role === "Parent" && (
                                            <LinkContainer
                                                className="nav-font-size-2"
                                                to="/parent/studentlist">
                                                <NavDropdown.Item>
                                                    My Children Class
                                                </NavDropdown.Item>
                                            </LinkContainer>
                                        )
                                    }
                                    {
                                        // userInfo.role === "Student" && (
                                        //     <LinkContainer
                                        //         className="nav-font-size-2"
                                        //         to="/student/exerciseList">
                                        //         <NavDropdown.Item>
                                        //             My Exercise
                                        //         </NavDropdown.Item>
                                        //     </LinkContainer>
                                        // )
                                    }
                                    <NavDropdown.Item
                                        className="nav-font-size-2"
                                        onClick={logoutHandler}
                                    >
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        ) : (
                            <Nav className="ml-auto nav-font-size">
                                <LinkContainer to="/login">
                                    <Nav.Link className="nav-font-size-2">
                                        <i className="fas fa-user " />
                                        Sign in
                                    </Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/register">
                                    <Nav.Link className="nav-font-size-2">
                                        <i className="fas fa-user " />
                                        Register
                                    </Nav.Link>
                                </LinkContainer>
                            </Nav>
                        )}

                        {userInfo && userInfo.isAdmin && (
                            <NavDropdown
                                title="Admin"
                                id="adminmenu"
                                className="nav-font-size-2"
                            >
                                <LinkContainer to="/admin/userlist">
                                    <NavDropdown.Item className="nav-font-size-2">Users</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/admin/auditClass">
                                    <NavDropdown.Item className="nav-font-size-2">Audit Class</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/admin/library">
                                    <NavDropdown.Item className="nav-font-size-2">Library</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/admin/libraryQuestion">
                                    <NavDropdown.Item className="nav-font-size-2">My Library</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/admin/emailList">
                                    <NavDropdown.Item className="nav-font-size-2">Email</NavDropdown.Item>
                                </LinkContainer>
                                {/* <LinkContainer to="/admin/ClassCategory">
                                    <NavDropdown.Item>
                                        Class Category
                                    </NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/admin/productlist">
                                    <NavDropdown.Item>
                                        Products
                                    </NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/admin/orderlist">
                                    <NavDropdown.Item>Orders</NavDropdown.Item>
                                </LinkContainer> */}
                            </NavDropdown>
                        )}

                        {userInfo && userInfo.role === "Teacher" && (
                            <NavDropdown
                                title="Teacher"
                                id="adminmenu"
                                className="nav-font-size-2"
                            >
                                <LinkContainer to="/teach/classlist">
                                    <NavDropdown.Item>
                                        My Classes
                                    </NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/teach/hwlist">
                                    <NavDropdown.Item>
                                        My Homeworks
                                    </NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/teach/questionlist">
                                    <NavDropdown.Item>
                                        My Questions
                                    </NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/teacher/library">
                                    <NavDropdown.Item>
                                        My Library
                                    </NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        )}
                        <Button className="header-language" variant="outline-dark" onClick={changeLanguage}>
                            {lang === "en" ? '中' : 'En'}
                        </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
