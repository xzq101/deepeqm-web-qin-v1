import React, { useState, useEffect } from "react";
import Pagination from '@mui/lab/Pagination';
import { Modal, Form } from "react-bootstrap";
import axios from '../../../utils/axios';
import Loader from "../../../components/Loader";
import Message from "../../../components/Message";

const options = ['A', 'B', 'C', 'D'];

export default function Profile() {

    // const [profiles, setProfiles] = useState([]);
    // const [student, setStudent] = useState({});

    // const getProfiles = () => {
    //     axios.get('/user/getProfile')
    //         .then(res => {
    //             if (res.result) {
    //                 const { profiles, student } = res.result;
    //                 setProfiles(profiles);
    //                 setStudent(student);
    //             }
    //         })
    // }
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [question, setQuestion] = useState({});

    const getQuestions = () => {
        setLoading(true);
        axios.get('/user/getStudentQuestionRecord', {
            params: {
                page,
                pageSize
            }
        }).then(res => {
            const { total, list } = res.result;
            setTotal(total);
            setQuestions(list);
        }).finally(() => {
            setLoading(false);
        });
    }

    const changePage = (event, value) => {
        setPage(value);
    }

    const openQuestionModal = (index) => {
        setShowQuestionModal(true);
        setQuestion(questions[index].question);
    }

    const closeQuestionModal = () => {
        setShowQuestionModal(false);
    }

    useEffect(() => {
        getQuestions();
    }, [page, pageSize]); // eslint-disable-line

    return (
        <div className="resources-profile">
            {/* <div className="resources-profile-container">
                <div className="resources-profile-user">
                    <div className="resources-profile-avatar" />
                    <div className="resources-profile-name">{student.name}</div>
                </div>
                <div className="resources-profile-list">
                    <div className="resources-profile-tip">*updated every 10 minutes</div>
                    {
                        profiles.map((item, index) => (
                            <div key={index} className="resources-profile-item">
                                <div className="resources-profile-item-title">{item.sourceId?.name}</div>
                                <div className="resources-profile-progress">
                                    <div className="bar bar-done resources-profile-progress-bar-animated" style={{ width: `${item.total ? item.done / item.total * 100 : 0}%` }}><span className="text">{item.done}</span></div>
                                    <div className="bar bar-correct resources-profile-progress-bar-animated" style={{ width: `${item.done ? item.correct / item.done * 100 : 0}%` }}><span className="text">{item.correct}</span></div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div> */}
            <div>
            {
                loading ? (<Loader />) : (
                    <div>
                        {
                            questions.length > 0 ?
                                (
                                    questions.map((q, index) => {
                                        const question = q.question;
                                        if (!question) {
                                            return null;
                                        }
                                        return (
                                            <div className='question profile-question' key={question._id} onClick={() => openQuestionModal(index)}>
                                                {q.isCorrect === true && <div className='question-correct-right'></div>}
                                                {q.isCorrect === false && <div className='question-correct-wrong'></div>}
                                                <div className='question-content' dangerouslySetInnerHTML={{ __html: question.qText }}></div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <Message variant="info">No Question</Message>
                                )
                        }
                    </div>
                )
            }
            </div>
            <Pagination class="profile-pagination" count={Math.ceil(total / pageSize)} page={page} onChange={changePage} />
            <Modal show={showQuestionModal} onHide={closeQuestionModal} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className='question' key={question._id}>
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
                                                disabled />
                                            <Form.Check.Label for={`answer${option}`}>
                                                <div className='question-option'>
                                                    <div className='label'>{`${option}.`}</div>
                                                    <div className='value' dangerouslySetInnerHTML={{
                                                        __html
                                                            : question[`answer${option}`]
                                                    }}></div>
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
                                                disabled />
                                            <Form.Check.Label for="answerE">
                                                <div className='question-option'>
                                                    <div className='label'>E.</div>
                                                    <div className='value' dangerouslySetInnerHTML={{
                                                        __html
                                                            : question[`answerE`]
                                                    }}></div>
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
                                                disabled />
                                            <Form.Check.Label for={`answer${option}`}>
                                                <div className='question-option'>
                                                    <div className='label'>{`${option}.`}</div>
                                                    <div className='value' dangerouslySetInnerHTML={{
                                                        __html
                                                            : question[`answer${option}`]
                                                    }}></div>
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
                                                disabled />
                                            <Form.Check.Label for="answerE">
                                                <div className='question-option'>
                                                    <div className='label'>E.</div>
                                                    <div className='value' dangerouslySetInnerHTML={{
                                                        __html
                                                            : question[`answerE`]
                                                    }}></div>
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
                                    disabled
                                />
                            </div>
                        )
                    }
                    <div className='question-correct'>Correct Answer: {question.correctAnswer}</div>
                </div>
                </Modal.Body>

            </Modal>
        </div>
    )
}