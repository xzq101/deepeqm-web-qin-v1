import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Container, Badge } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import axios from '../utils/axios';

const ParentStudentsListView = ({ history, match }) => {
    const [studentList, setStudentList] = useState([])

    const getStudents = () => {
        axios.get('/user/getStudentsByEmail')
            .then(res => {
                setStudentList(res.result.list)
            })
    }

    useEffect(() => {
        getStudents()
    }, []);

    return (
        <Container>
            {
                studentList.map(student => (
                    <div key={student._id} style={{ marginBottom: '50px' }}>
                        <Row className="align-items-center" style={{ marginBottom: '30px' }}>
                            <Col>
                                <h3>{student.name} Class</h3>
                            </Col>
                        </Row>
                        <Container>
                            <Table striped bordered hover responsive className="table-sm">
                                <thead>
                                    <tr>

                                        <th>NAME</th>
                                        <th>PRICE</th>
                                        <th>CATEGORY</th>
                                        <th>Start </th>
                                        <th>End </th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    {student.classList.map(cl => (
                                        <tr key={cl._id}>
                                            <td>{cl.classInfo.name}</td>
                                            <td>{cl.classInfo.price}</td>
                                            <td>{cl.classInfo.classID?.category}</td>
                                            <td>{cl.classInfo.classID?.startDate.split ('T')[0]}</td>
                                            <td>{cl.classInfo.classID?.endDate.split ('T')[0]}</td>
                                            <td>
                                                <LinkContainer to={`/parent/student/exercise/${cl.student.ID}/${cl.classInfo.classID?._id}`}>
                                                    <Button variant="light" className="btn-sm">
                                                        Exercise
                                                    </Button>
                                                </LinkContainer>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Container>
                    </div>
                ))
            }
        </Container>
    );
};

export default ParentStudentsListView;
