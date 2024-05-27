import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Container, Badge } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import axios from '../utils/axios';
import { getCorrectNumber } from '../utils/correct';

const ParentStudentsExerciseList = ({ history, match }) => {
    const [exerciseList, setExerciseList] = useState([]);
    const [bulletin, setBulletin] = useState('');

    const { studentId, classId } = match.params;

    const getStudents = () => {
        axios.get('/user/getStudentExerciseList', {
            params: {
                studentId,
                classId
            }
        }).then(res => {
            setExerciseList(res.result.list);
        });
    }

    const getClass = () => {
        axios.get('/public/getClassById?id=' + classId).then(res => {
            setBulletin(res.result.bulletin);
        });
    }

    useEffect(() => {
        getStudents();
        getClass();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Container>
            <Row className="align-items-center">
                <Col>
                    <h1>My Students Exercise </h1>
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
                            <th>Class</th>
                            <th>HomeWork</th>
                            <th>Due Date</th>
                            <th>Progress Tracker</th>
                            <th>Accuracy Tracker</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exerciseList.map(cl => (
                            <tr key={cl._id}>
                                <td>{cl.student.name}</td>
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
                                    <LinkContainer to={`/student/exercise/${cl._id}`}>
                                        <Button variant="light" className="btn-sm">
                                            Detail
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

export default ParentStudentsExerciseList;
