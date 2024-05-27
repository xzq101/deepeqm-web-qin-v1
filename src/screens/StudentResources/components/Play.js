import React, { useState, useEffect, useRef } from "react";
import { ProgressBar, Form, Button, Spinner, Modal } from 'react-bootstrap';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useSnackbar, closeSnackbar } from 'notistack';
import Loader from '../../../components/Loader';
import axios from '../../../utils/axios';
import Message from "../../../components/Message";
import { getAnswerResult } from '../../../utils/correct';

const options = ['A', 'B', 'C', 'D'];

export default function Play() {
    const { enqueueSnackbar } = useSnackbar();
    const questions = useRef([]);
    const [question, setQuestion] = useState({});
    const [current, setCurrent] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [answer, setAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const [reportVisible, setReportVisible] = useState(false);
    const errorTypes = [{ value: '1', label: 'Incorrect Question'}, { value: '2', label: 'Incorrect Answer'}, { value: '3', label: 'Other'}];
    const [errorType, setErrorType] = useState('3');
    const [otherContent, setOtherContent] = useState('');
    const [reportSubmitting, setReportSubmitting] = useState(false);

    const snackbarId = useRef(null);

    const reset = () => {
        setShowSolution(false);
        setIsCorrect(null);
        setAnswer('');
    }

    const getQuestion = () => {
        setLoading(true);
        reset();
        axios.get('/user/getResourceQuestion')
            .then(res => {
                const { questions: questionList, done, total } = res.result;
                setQuestion(questionList.shift());
                questions.current = questionList;
                setCurrent(done === total ? done : done + 1);
                setTotal(total);
            })
            .finally(() => setLoading(false));
    }

    const toggleSolution = () => {
        setShowSolution(!showSolution);
    }

    const setMultAnswer = (option) => {
        const answers = answer.split(',');
        if (answers.includes(option)) {
            answers.splice(answers.indexOf(option), 1);
        } else {
            answers.push(option);
            answers.sort();
        }
        setAnswer(answers.filter(item => item).join(','));
    }

    const submitQuestion = () => {
        if (!answer) {
            if (question.isChoice === '0' || question.isChoice === '1') {
                enqueueSnackbar('Please select your answer', { variant: 'error' });
            }
            if (question.isChoice === '2') {
                enqueueSnackbar('Please input your answer', { variant: 'error' });
            }
            return;
        }
        if (submitting) {
            return;
        }
        setSubmitting(true);
        axios.post('/user/submitResourceQuestion', {
            questionId: question._id,
            answer
        }).then(res => {
            const { isCorrect, correctAnswer, description } = res.result;
            setIsCorrect(isCorrect); 
            const newQuestion = { ...question, correctAnswer, isCorrect, description };
            setQuestion(newQuestion);
        }).finally(() => setSubmitting(false));
    }

    const next = () => {
        if (questions.current.length) {
            setQuestion(questions.current.shift());
            setCurrent(current + 1);
            reset();
        } else {
            getQuestion();
        }
    }

    const giveUp = () => {
        if (window.confirm('Are you sure to give up this question?')) {
            axios.post('/user/giveUpResourceQuestion')
                .then(res => {
                    next();
                });
        }
    }

    const closeReportModal = () => {
        setReportVisible(false);
    }

    const openReportModal = () => {
        setErrorType('1');
        setOtherContent('');
        setReportVisible(true);
    }

    const submitReport = () => {
        if (errorType === '3' && !otherContent) {
            enqueueSnackbar('Please input your report content', { variant: 'error' });
            return;
        }
        if (reportSubmitting) {
            return;
        }
        setReportSubmitting(true);
        snackbarId.current = enqueueSnackbar('Submitting report...', { variant: 'info', persist: true });
        axios.post('/user/reportResourceQuestion', {
            questionId: question._id,
            errorType,
            otherContent,
        }).then(res => {
            enqueueSnackbar('Report submitted successfully', { variant: 'success' });
            closeSnackbar(snackbarId.current);
        }).finally(() => setReportSubmitting(false));
        closeReportModal();
    }

    useEffect(() => {
        getQuestion();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="resources-play">
            <ProgressBar animated striped variant="success" now={total ? (current / total * 100) : 0} label={`${current}/${total}`} style={{ marginBottom: '20px' }} />
            {
                loading ? <Loader /> : (
                    question ? (
                        <div>
                            <div className='question'>
                                {/* <div className='question-title'>{question.name}</div> */}
                                <div className='question-title'>Question</div>
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
                                                            name={question._id}
                                                            checked={answer === option}
                                                            disabled={!!question.correctAnswer}
                                                            onChange={() => setAnswer(option)} />
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
                                                            name={question._id}
                                                            checked={answer === 'E'}
                                                            disabled={!!question.correctAnswer}
                                                            onChange={() => setAnswer('E')} />
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
                                                            name={question._id}
                                                            checked={answer.split(',').includes(option)}
                                                            disabled={!!question.correctAnswer}
                                                            onChange={() => setMultAnswer(option)} />
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
                                                            name={question._id}
                                                            checked={answer.split(',').includes('E')}
                                                            disabled={!!question.correctAnswer}
                                                            onChange={() => setMultAnswer('E')} />
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
                                                value={answer}
                                                disabled={!!question.correctAnswer}
                                                onChange={(e) => setAnswer(e.target.value)}
                                            />
                                        </div>
                                    )
                                }
                                <div className="resources-play-report" onClick={openReportModal}>report bug</div>
                                <div style={{ marginTop: '10px' }}>
                                    { getAnswerResult({ isCorrect }) }
                                </div>
                                {
                                    question.correctAnswer && <div className='question-correct'>Correct Answer: {question.correctAnswer}</div>
                                }
                                {
                                    showSolution && (
                                        <div className='question-solution'>
                                            <div className='question-sub-title'>Solution</div>
                                            <div className='question-content' dangerouslySetInnerHTML={{ __html: question.description }}></div>
                                        </div>
                                    )
                                }
                                <div className='question-btns'>
                                    {
                                        !question.correctAnswer && <Button className='question-btn' onClick={submitQuestion}>
                                            {submitting ? <Spinner animation="border" size="sm" /> : 'Submit'}
                                        </Button>
                                    }
                                    {
                                        question.correctAnswer && (
                                            <Button variant="info" className='question-btn' onClick={next}>Next</Button>
                                        )
                                    }
                                    {
                                        !question.correctAnswer && (
                                            <Button variant="danger" className='question-btn' onClick={giveUp}>Give Up</Button>
                                        )
                                    }
                                    {
                                        question.correctAnswer && (
                                            <Button variant="success" className='question-btn' onClick={toggleSolution}>{showSolution ? 'hide' : 'show'} solution</Button>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Message variant="success">All questions are done!</Message>
                        </div>
                    )
                )
            }
            <Modal show={reportVisible} onHide={closeReportModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Report Bug</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl>
                        <FormLabel id="error-type">Type</FormLabel>
                        <RadioGroup
                            row
                            name="errorType"
                            value={errorType}
                            onChange={(e) => setErrorType(e.target.value)}
                        >
                            {
                                errorTypes.map((type, index) => (
                                    <FormControlLabel key={type.value} value={type.value} control={<Radio />} label={type.label} />
                                ))
                            }
                        </RadioGroup>
                    </FormControl>
                    {
                        errorType === '3' && (
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={otherContent}
                                onChange={(e) => setOtherContent(e.target.value)}
                            />
                        )
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={submitReport}>
                        {/* {
                            reportSubmitting ? <Spinner animation="border" size="sm" /> : 'Submit'
                        } */}
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}