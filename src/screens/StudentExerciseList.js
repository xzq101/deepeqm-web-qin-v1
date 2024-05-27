import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Container, Badge } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import axios from '../utils/axios';
import { getCorrectNumber } from '../utils/correct';

const StudentExerciseList = ({ history, match }) => {
    const [exerciseList, setExerciseList] = useState([])

    const getExercise = () => {
        axios.get('/user/getExerciseList')
            .then(res => {
                setExerciseList(res.result.list)
            })
    }

    useEffect(() => {
        getExercise()
    }, []);

    return (
        <Container>
            <Row className="align-items-center">
                <Col>
                    <h1>My Exercise </h1>
                </Col>
            </Row>
            <Container>
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>HomeWork</th>
                            <th>Due Date</th>
                            <th>Progress Tracker</th>
                            <th>Accuracy Tracker</th>
                            <td />
                        </tr>
                    </thead>
                    <tbody>
                        {exerciseList.map(cl => (
                            <tr key={cl._id}>
                                <td>{cl.classId?.name}</td>
                                <td>{cl.homeworkId.name}</td>
                                <td>
                                    {cl.homeworkId.dueDate ? cl.homeworkId.dueDate.split ('T')[0] : ''}&nbsp;
                                    {
                                        (new Date(cl.homeworkId.dueDate) < new Date() && cl.questionList.some(q => !q.answeredAt)
                                        )
                                        && <Badge variant="danger">overdue</Badge>
                                    }
                                </td>
                                <td>
                                    {cl.questionList.filter(q => q.answeredAt).length} / {cl.questionList.length}
                                </td>
                                <td>
                                    {getCorrectNumber(cl)} / {cl.questionList.length}
                                </td>
                                <td>
                                    <LinkContainer to={`/student/exerciseEdit/${cl._id}`}>
                                        <Button variant="light" className="btn-sm">
                                            <i className="fas fa-pen" />
                                        </Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </Container>
    );
};

export default StudentExerciseList;
