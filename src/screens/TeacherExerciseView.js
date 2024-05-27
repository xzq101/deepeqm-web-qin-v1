import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Container, Badge  } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import Pagination from '@mui/lab/Pagination';
import axios from '../utils/axios';
import { getCorrectNumber } from '../utils/correct';

const TeacherExerciseView = ({ history, match }) => {
    const [studentList, setStudentList] = useState([]);
    const [bulletin, setBulletin] = useState('');
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);

    const { id, classId } = match.params;

    const getStudents = () => {
        axios.get('/teacher/getExerciseByClass', {
            params: {
                classID: classId,
                studentID: id
            }
        }).then(res => {
            setStudentList(res.result.list);
        });
    }

    const getClass = () => {
        axios.get('/public/getClassById?id=' + classId).then(res => {
            setBulletin(res.result.bulletin);
        });
    }

    const getStudentExerciseByClass = () => {
        axios.get('/teacher/getStudentExerciseByClass', {
            params: {
                classId,
                studentId: id,
                page,
                pageSize
            }
        }).then(res => {
            const { total, list, correct, wrong } = res.result;
            setRecords(list);
            setTotal(total);
            setCorrect(correct);
            setWrong(wrong);
        });
    
    }

    const changePage = (event, value) => {
        setPage(value);
    }

    useEffect(() => {
        getStudents();
        getClass();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        getStudentExerciseByClass();
    }, [page, pageSize]); // eslint-disable-line

    return (
        <Container>
            <Row className="align-items-center">
                <Col>
                    <h1>Exercise </h1>
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
                            <th>Homework</th>
                            <th>Due Date</th>
                            <th>Progress Tracker</th>
                            <th>Accuracy Tracker</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {studentList.map(cl => (
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
            <Row className="align-items-center" style={{ marginTop: '30px' }}>
                <Col>
                    <h2>Resource Records</h2>
                    <p>Progress Tracker: {correct + wrong} / {total}&nbsp;&nbsp;&nbsp;&nbsp;Accuracy Tracker: {correct} / {total}</p>
                    <Table striped bordered hover responsive className="table-sm">
                        <thead>
                            <tr>
                                <th>Question</th>
                                <th>Answer</th>
                                <th>Correct Answer</th>
                                <th>Corrections</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(cl => (
                                <tr key={cl._id}>
                                    <td>{cl.question.name}</td>
                                    <td>{cl.answer}</td>
                                    <td>{cl.question.correctAnswer}</td>
                                    <td>{cl.isCorrect ? <div className='question-correct-right' style={{ marginTop: 0 }}></div> : <div className='question-correct-wrong' style={{ marginTop: 0 }}></div>}</td>
                                    <td>{cl.createdAt.substring (0, 10)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination class="profile-pagination" count={Math.ceil(total / pageSize)} page={page} onChange={changePage} />
                </Col>
            </Row>
        </Container>
    );
};

export default TeacherExerciseView;
