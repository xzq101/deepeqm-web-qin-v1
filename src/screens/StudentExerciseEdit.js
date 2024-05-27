import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Container, ProgressBar, Form, Spinner } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { getEditorConfig, toolbarConfig } from '../config/editor-config';
import Message from '../components/Message';
import axios from '../utils/axios';
import { getAnswerResult, getCorrectDetail } from '../utils/correct';

const options = ['A', 'B', 'C', 'D'];



const StudentExerciseEdit = ({ history, match }) => {
    const [questions, setQuestions] = useState([]);
    const [exercise, setExercise] = useState({ question: {} });
    const question = exercise.question;
    const [current, setCurrent] = useState(0);
    const [answer, setAnswer] = useState('');
    const [editor, setEditor] = useState(null);
    const [content, setContent] = useState('');
    const [isAnswer, setIsAnswer] = useState(false);
    const [homeworkDetail, setHomeworkDetail] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [updateContentLoading, setUpdateContentLoading] = useState(false);

    const editorConfig = getEditorConfig();

    const getExercise = () => {
        axios.get(`/user/getExerciseById?id=${match.params.id}`)
            .then(res => {
                const questionList = res.result.questionList;
                setQuestions(questionList);
                setHomeworkDetail(res.result.homeworkId);
            })
    }

    const nextQuestion = () => {
        if (current < questions.length) {
            const newQuestions = [...questions];
            const newQuestion = newQuestions[current - 1];
            if (newQuestion.answer === answer && newQuestion.content === content) {
                setCurrent(current + 1);
            } else {
                saveAnswer().then(() => {
                    newQuestion.answer = answer;
                    newQuestion.content = content;
                    setQuestions(newQuestions);
                    setCurrent(current + 1);
                });
            }
        }
    }

    const prevQuestion = () => {
        if (current > 1) {
            setCurrent(current - 1);
        }
    }

    const finsh = () => {
        const newQuestions = [...questions];
        const newQuestion = newQuestions[current - 1];
        if (newQuestion.answer !== answer) {
            saveAnswer().then(() => {
                history.go(-1);
            });
        } else {
            history.go(-1);
        }
    }

    const saveAnswer = () => axios.post('/user/saveExercise', {
        id: match.params.id,
        questionId: question._id,
        answer: answer,
        content: content
    });

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
                setErrorMessage('Please select your answer');
            }
            if (question.isChoice === '2') {
                setErrorMessage('Please input your answer');
            }
            return;
        }
        axios.post('/user/submitExercise', {
            id: match.params.id,
            questionId: question._id,
            answer: answer,
            content: content
        }).then((res) => {
            const { correctAnswer, autoCorrect, description } = res.result;
            const newQuestions = [...questions];
            const newQuestion = newQuestions[current - 1];
            newQuestion.question.correctAnswer = correctAnswer;
            newQuestion.question.description = description;
            newQuestion.answer = answer;
            newQuestion.content = content;
            newQuestion.autoCorrect = autoCorrect;
            setQuestions(newQuestions);
        }).catch((error) => {
            // setErrorMessage(error.msg);
        });
    }

    const updateContent = () => {
        if (!content || content === '<p><br></p>') {
            return;
        }
        if (updateContentLoading) return;
        setUpdateContentLoading(true);
        axios.post('/user/updateExerciseContent', {
            id: match.params.id,
            questionId: question._id,
            content: content
        }).then((res) => {
            const newQuestions = [...questions];
            const newQuestion = newQuestions[current - 1];
            newQuestion.content = content;
            setQuestions(newQuestions);
            setUpdateContentLoading(false);
        }).catch((error) => {
            setUpdateContentLoading(false);
        });
    }

    const start = () => {
        setIsAnswer(true);
        setCurrent(1);
    }

    const showSolution = () => {
        const newQuestions = [...questions];
        const newQuestion = newQuestions[current - 1];
        newQuestion.showSolution = !newQuestion.showSolution;
        setQuestions(newQuestions);
    }

    useEffect(() => {
        getExercise()
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (current === 0) return;
        if (questions.length > 0) {
            const q = questions[current - 1];
            setExercise(q);
            setAnswer(q.answer);
            setContent(q.content || '');
            // if (q.question.correctAnswer) {
            //     editor && editor.disable();
            // } else {
            //     editor && editor.enable();
            // }
            setErrorMessage('');
        }
    }, [current, questions, editor]);

    useEffect(() => {
        return () => {
            if (editor == null) return;
            editor.destroy();
            setEditor(null);
        }
    }, [editor]);

    return (
        <Container>
            <Row className="align-items-center">
                <Col>
                    <h1>Exercise</h1>
                </Col>
            </Row>
            {
                isAnswer ? (
                    <Container>
                        <ProgressBar animated striped variant="success" now={questions.length ? current / questions.length * 100 : 0} label={`${current}/${questions.length}`} style={{ marginTop: '20px' }} />
                        <div className='question'>
                            <div className='question-title'>Question {current}</div>
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
                            <div style={{ marginTop: '10px' }}>
                                {/* { rightMessage && <Message variant='success'>{rightMessage}</Message> } */}
                                { errorMessage && <Message variant='danger'>{errorMessage}</Message> }
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                { getAnswerResult(exercise) }
                            </div>
                            <div className='question-sub-title'>Answer content</div>
                            <div style={{ border: '1px solid #ccc', zIndex: 100, marginTop: '20px' }}>
                                <Toolbar
                                    editor={editor}
                                    defaultConfig={toolbarConfig}
                                    mode="default"
                                    style={{ borderBottom: '1px solid #ccc' }}
                                />
                                <Editor
                                    defaultConfig={editorConfig}
                                    value={content}
                                    onCreated={setEditor}
                                    onChange={editor => setContent(editor.getHtml())}
                                    mode="default"
                                    style={{ height: '300px', overflowY: 'hidden' }}
                                />
                            </div>
                            {
                                question.correctAnswer && <div className='question-correct'>Correct Answer: {question.correctAnswer}</div>
                            }
                            {
                                getCorrectDetail(exercise)
                            }
                            {
                                exercise.showSolution && (
                                    <div className='question-solution'>
                                        <div className='question-sub-title'>Solution</div>
                                        <div className='question-content' dangerouslySetInnerHTML={{ __html: question.description }}></div>
                                    </div>
                                )
                            }
                            <div className='question-btns'>
                                {
                                    !question.correctAnswer && <Button className='question-btn' onClick={submitQuestion}>Submit</Button>
                                }
                                {
                                    question.correctAnswer && <Button className='question-btn' onClick={updateContent}>
                                        {updateContentLoading ? <Spinner animation="border" size="sm" /> : 'Update Content'}
                                    </Button>
                                }
                                {
                                    current > 1 && (
                                        <Button variant="info" className='question-btn' onClick={prevQuestion}>Prev</Button>
                                    )
                                }
                                {
                                    current < questions.length && (
                                        <Button variant="info" className='question-btn' onClick={nextQuestion}>Next</Button>
                                    )
                                }
                                {
                                    current === questions.length && (
                                        <Button variant="success" className='question-btn' onClick={finsh}>Finish</Button>
                                    )
                                }
                                <Button disabled={!question.correctAnswer} variant="success" className='question-btn' onClick={showSolution}>{exercise.showSolution ? 'hide' : 'show'} solution</Button>
                            </div>
                        </div>
                    </Container>
                ) : (
                    <Container>
                        <div className='question'>
                            <div className='question-title'>{homeworkDetail.name}</div>
                            <div className='question-level'>Due Date: {homeworkDetail.dueDate ? homeworkDetail.dueDate.split('T')[0] : ''}</div>
                            <div className='question-content' dangerouslySetInnerHTML={{ __html: homeworkDetail.description }}></div>
                        </div>
                        <div className='question-btns'>
                            {
                                questions.length > 0 && (
                                    <Button variant="success" className='question-btn' onClick={start}>Start</Button>
                                )
                            }
                        </div>
                    </Container>
                )
            }

        </Container>
    );
};

export default StudentExerciseEdit;
