import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Row, Col, Container, Badge } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import axios from '../utils/axios';
import { getCorrectNumber } from '../utils/correct';

const MyHomeworkView = ({ history, match }) => {
    const id = match.params.id;
    const [homework, setHomework] = useState([]);
    const [bulletin, setBulletin] = useState('');

    const getHomework = () => {
        axios.get(`/user/getExerciseByClassId?id=${id}`).then(res => {
            setHomework(res.result.list);
        });
    }

    const getClass = () => {
        axios.get('/public/getClassById?id=' + id).then(res => {
            setBulletin(res.result.bulletin);
        });
    }

    useEffect(() => {
        getHomework();
        getClass();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Container>
            <Row className="align-items-center">
                <Col>
                    <h1>Homework </h1>
                </Col>
            </Row>
            <Container>
                {
                    bulletin && <div className='class-bulletin rich-text' dangerouslySetInnerHTML={{ __html: bulletin }}></div>
                }
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Due Date</th>
                            <th>Progress Tracker</th>
                            <th>Accuracy Tracker</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {homework.map(homework => (
                            <tr key={homework._id}>
                                <td>{homework.homeworkId.name}</td>
                                <td>
                                    {homework.homeworkId.dueDate ? homework.homeworkId.dueDate.split('T')[0] : ''}&nbsp;
                                    {
                                        (new Date(homework.homeworkId.dueDate) < new Date() && homework.questionList.some(q => !q.answeredAt)
                                        )
                                        && <Badge variant="danger">overdue</Badge>
                                    }
                                </td>
                                <td>
                                    {homework.questionList.filter(q => q.answeredAt).length} / {homework.questionList.length}
                                </td>
                                <td>
                                    {getCorrectNumber(homework)} / {homework.questionList.length}
                                </td>
                                <td>
                                    {
                                        homework.questionList.filter(q => q.answeredAt).length === homework.questionList.length ?
                                        (
                                            <LinkContainer to={`/student/exercise/${homework._id}`}>
                                                <Button variant="info" className="btn-sm">View details</Button>
                                            </LinkContainer>
                                        ) : (
                                            <LinkContainer to={`/student/exerciseEdit/${homework._id}`}>
                                                <Button variant="info" className="btn-sm">start learning</Button>
                                            </LinkContainer>
                                        )
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </Container>
    );
};

export default MyHomeworkView;
