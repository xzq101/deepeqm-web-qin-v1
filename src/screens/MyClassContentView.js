import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import {
    Form,
    Table,
    Button,
    Row,
    Col,
    Container,
    ButtonGroup,
    DropdownButton,
    Dropdown,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import QuestionView from "../components/QuestionView";
import SimView from "../components/SimView";
import CanvasSelf from "../canvas/Canvas";

import { MY_CLASS_LIST_RESET } from "../constants/registerConstants";
import { listMyClasses } from "../actions/registerAction";
import { fetchHWList } from "../actions/startLearningAction";

const MyClassContentView = ({ history, match }) => {
    const dispatch = useDispatch();
    const registerID = match.params.id;
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const myClassList = useSelector((state) => state.myClassList);
    const {
        loading: loadingMyClasses,
        error: errorMyClasses,
        myClasses,
    } = myClassList;

    const classInfo = useSelector((state) => state.myHWListInClass);
    const {
        loading: loadingMyHWList,
        error: errorMyHWList,
        classContent,
    } = classInfo;

    useEffect(() => {
        if (!userInfo) {
            history.push("/login");
        } else {
            // dispatch (listMyClasses ());
            dispatch(fetchHWList(registerID, userInfo));
        }
    }, [dispatch, history, userInfo, registerID]);

    function draw(context) {
        context.fillStyle = "rgb(200, 0, 0)";
        context.fillRect(10, 10, 50, 50);
    }
    return (
        <Container>
            {loadingMyHWList ? (
                <Loader />
            ) : errorMyHWList ? (
                <Message variant="danger">{errorMyHWList}</Message>
            ) : (
                <Container />
            )}

            {classContent ? (
                <Container>
                    <h2>{` ${classContent.name} for ${userInfo.name}`}</h2>
                </Container>
            ) : (
                <h4> </h4>
            )}

            {classContent ? (
                <Container>
                    <Row>
                        <Col sm={3}>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>HomeWorks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classContent.homeworkList.map((hw) =>
                                        hw.isPublish ||
                                        hw.creator.toString() ===
                                            userInfo._id.toString() ? (
                                            <tr key={hw._id}>
                                                <td>
                                                    <Button
                                                        variant="info"
                                                        className="btn-sm"
                                                    >
                                                        {`${hw.name}`}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr />
                                        )
                                    )}
                                </tbody>
                            </Table>
                        </Col>

                        <Col sm={9}>
                            <QuestionView />
                            <SimView />
                            <CanvasSelf draw={draw} height={100} width={100} />
                        </Col>
                    </Row>
                </Container>
            ) : (
                <h4>No HomeWork added.</h4>
            )}
        </Container>
    );
};

export default MyClassContentView;
