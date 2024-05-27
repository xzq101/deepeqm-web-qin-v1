import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Container, Form } from 'react-bootstrap';
import { useSelector } from "react-redux";
import axios from '../utils/axios';
import { getCorrectDetail } from '../utils/correct';

const options = ['A', 'B', 'C', 'D'];

const StudentExerciseDetail = ({ history, match }) => {
    const [questions, setQuestions] = useState([]);
    const userLogin = useSelector (state => state.userLogin);
    const {userInfo} = userLogin;


    const getExercise = () => {
        axios.get(`/user/getStudentExerciseDetail?id=${match.params.id}`)
            .then(res => {
                const questionList = res.result.questionList;
                setQuestions(questionList);
            })
    }

    useEffect(() => {
        getExercise()
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Container>
            <Row className="align-items-center">
                <Col>
                    <h1>Exercise Detail</h1>
                </Col>
            </Row>
            <Container>
                <div>
                    {
                        questions.map((q, index) => {
                            const question = q.question;
                            return (
                                <div className='question question-border' key={question._id}>
                                    <div className='question-title'>Question {index + 1}</div>
                                    {/* <div className='question-level'>level: {question.difficuty}</div> */}
                                    <div className='question-content' dangerouslySetInnerHTML={{ __html: question.qText }}></div>
                                    {
                                        question.isChoice === '0' && (
                                            <div className='question-options'>
                                                {
                                                    options.map((option, index) => (
                                                        <Form.Check key={option} type="radio">
                                                            <Form.Check.Input
                                                                type="radio"
                                                                id={`answer${option}`}
                                                                name={q._id}
                                                                checked={q.answer === option}
                                                                disabled />
                                                            <Form.Check.Label for={`answer${option}`}>
                                                                <div className='question-option'>
                                                                    <div className='label'>{`${option}.`}</div>
                                                                    <div className='value' dangerouslySetInnerHTML={{ __html
                                                                    : question[`answer${option}`] }}></div>
                                                                </div>
                                                            </Form.Check.Label>
                                                        </Form.Check>
                                                    ))
                                                }
                                                {
                                                    Number(question.numChoice) > 4 && (
                                                        <Form.Check type="radio">
                                                            <Form.Check.Input
                                                                type="radio"
                                                                id="answerE"
                                                                name={q._id}
                                                                checked={q.answer === 'E'}
                                                                disabled />
                                                            <Form.Check.Label for="answerE">
                                                                <div className='question-option'>
                                                                    <div className='label'>E.</div>
                                                                    <div className='value' dangerouslySetInnerHTML={{ __html
                                                                    : question[`answerE`] }}></div>
                                                                </div>
                                                            </Form.Check.Label>
                                                        </Form.Check>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                    {
                                        question.isChoice === '1' && (
                                            <div className='question-options'>
                                                {
                                                    options.map((option, index) => (
                                                        <Form.Check key={option} type="checkbox">
                                                            <Form.Check.Input
                                                                type="checkbox"
                                                                id={`answer${option}`}
                                                                name={q._id}
                                                                checked={q.answer.split(',').includes(option)}
                                                                disabled />
                                                            <Form.Check.Label for={`answer${option}`}>
                                                                <div className='question-option'>
                                                                    <div className='label'>{`${option}.`}</div>
                                                                    <div className='value' dangerouslySetInnerHTML={{ __html
                                                                    : question[`answer${option}`] }}></div>
                                                                </div>
                                                            </Form.Check.Label>
                                                        </Form.Check>
                                                    ))
                                                }
                                                {
                                                    Number(question.numChoice) > 4 && (
                                                        <Form.Check type="checkbox">
                                                            <Form.Check.Input
                                                                type="checkbox"
                                                                id="answerE"
                                                                name={q._id}
                                                                checked={q.answer.split(',').includes('E')}
                                                                disabled />
                                                            <Form.Check.Label for="answerE">
                                                                <div className='question-option'>
                                                                    <div className='label'>E.</div>
                                                                    <div className='value' dangerouslySetInnerHTML={{ __html
                                                                    : question[`answerE`] }}></div>
                                                                </div>
                                                            </Form.Check.Label>
                                                        </Form.Check>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                    {
                                        question.isChoice === '2' && (
                                            <div className='question-textarea'>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    value={q.answer}
                                                    disabled
                                                />
                                            </div>
                                        )
                                    }
                                    {
                                        q.content && (q.content !== '<p><br></p>') && (
                                            <div>
                                                <div className='question-sub-title'>Answer content</div>
                                                <div dangerouslySetInnerHTML={{ __html: q.content }}></div>
                                            </div>
                                        )
                                    }
                                    <div className='question-correct'>Correct Answer: {question.correctAnswer}</div>
                                    { getCorrectDetail(q) }
                                    {
                                        userInfo.role === 'Student' && (
                                            <div className='question-solution'>
                                                <div className='question-sub-title'>Solution</div>
                                                <div className='question-content' dangerouslySetInnerHTML={{ __html: question.description }}></div>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </Container>
        </Container>
    );
};

export default StudentExerciseDetail;
