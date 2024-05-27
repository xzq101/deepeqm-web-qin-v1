import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Modal, Button, Row, Col, Container, Form, Spinner } from 'react-bootstrap';
import axios from '../utils/axios';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { getEditorConfig, toolbarConfig } from '../config/editor-config';
import Loader from '../components/Loader';
import { getCorrectResult, getCorrectNumber } from '../utils/correct';


const options = ['A', 'B', 'C', 'D'];

const CorrectionExerciseScreen = ({ match }) => {
    const [studentList, setStudentList] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [questions, setQuestions] = useState([]);
    const [correctionStatus, setCorrectionStatus] = useState(0); // 0: not correct, 1: correct
    const [loading, setLoading] = useState(false);
    const [finishLoading, setFinishLoading] = useState(false);
    const editors = useRef([]);
    const { homeworkId, classId } = match.params;
    const exerciseId = useRef(null);
    const [editorsKey, setEditorsKey] = useState([]);
    const [fold, setFold] = useState(false);
    const [sendEmailVisible, setSendEmailVisible] = useState(false);
    const [emailEditor, setEmailEditor] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [currentStudent, setCurrentStudent] = useState({});
    const [sendLoading, setSendLoading] = useState(false);

    const editorConfig = getEditorConfig();

    const getStudents = () => {
        setLoading(true);
        axios.get('/teacher/getExerciseByClassAndHomework', {
            params: {
                classID: classId,
                hwID: homeworkId
            }
        }).then(res => {
            setStudentList(res.result.list);
            if (res.result.list.length > 0) {
                setActiveIndex(0);
                selectStudent(res.result.list[0]._id);
            }
        });
    }

    const getExerciseDetail = (id) => {
        axios.get(`/user/getStudentExerciseDetail?id=${id}`).then(res => {
            const { questionList, correctionStatus: status, student } = res.result;
            setLoading(false);
            setQuestions(questionList);
            setCorrectionStatus(status);
            setCurrentStudent(student);
        });
    }

    const selectStudent = (id) => {
        exerciseId.current = id;
        if (studentList.length > 0) {
            const index = studentList.findIndex(s => s._id === id);
            setActiveIndex(index);
        }
        setLoading(true);
        editors.current.forEach((q, index) => {
            if (q) {
                q.destroy();
                editors.current[index] = null;
            }
        });
        
        getExerciseDetail(id);
    }

    const setEditor = (editor, index) => {
        editors.current[index] = editor;
        const newEditorsKey = [...editorsKey];
        newEditorsKey[index] = editor.id;
        setEditorsKey(newEditorsKey);
    }

    const correct = (result, index) => {
        const newQuestions = [...questions];
        const q = newQuestions[index];
        axios.post('/teacher/correctExercise', {
            questionId: q._id,
            exerciseId: exerciseId.current,
            comments: editors.current[index].getHtml(),
            isCorrect: result
        }).then(res => {
            newQuestions[index].isCorrect = result;
            setQuestions(newQuestions);
        });
    }

    const submitComments = (index) => {
        const newQuestions = [...questions];
        const q = newQuestions[index];
        q.loading = true;
        setQuestions(newQuestions);
        axios.post('/teacher/correctExercise', {
            questionId: q._id,
            exerciseId: exerciseId.current,
            comments: editors.current[index].getHtml(),
            isCorrect: q.isCorrect
        }).then(res => {
            const qs = [...questions];
            qs[index].loading = false;
            qs[index].comments = editors.current[index].getHtml();
            setQuestions(qs);
        }).catch(err => {
            const qs = [...questions];
            qs[index].loading = false;
            setQuestions(qs);
        });
    }

    const onHandleFold = () => {
        setFold(!fold);
    }

    const finishCorrection = () => {
        setFinishLoading(true);
        axios.post('/teacher/finishCorrection', {
            exerciseId: exerciseId.current
        }).then(res => {
            setFinishLoading(false);
            setCorrectionStatus('1');
            const list = [...studentList];
            const student = list.find(s => s._id === exerciseId.current);
            student.correctionStatus = '1';
            setStudentList(list);

        }).catch(err => {
            setFinishLoading(false);
        });
    }

    const openSendEmail = () => {
        setSendEmailVisible(true);
        setTitle('作业批改完成通知');
        setContent(`${currentStudent.name}，你的作业已经批改完成，请尽快查阅。`);
    }

    const closeSendEmail = () => {
        setSendEmailVisible(false);
    }

    const sendEmail = () => {
        setSendLoading(true);
        axios.post('/teacher/sendCorrectionEmail', {
            email: currentStudent.email,
            title,
            content
        }).then(res => {
            closeSendEmail();
            setSendLoading(false);
        }).catch(err => {
            setSendLoading(false);
        });
    }

    useEffect(() => {
        getStudents();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        return () => {
          if (emailEditor == null) return;
          if (sendEmailVisible) return;
          emailEditor.destroy();
          setEmailEditor(null);
        }
      }, [emailEditor, sendEmailVisible]);

    return (
        <div>
            <h1>Correct Exercise</h1>
            <div className='correction-exercise-list'>
                {
                    !fold && studentList.length > 0 && (
                        <div className='correction-exercise-list-scroll'>
                            <div className='correction-exercise-list-con'>
                                {
                                    studentList.map((cl, index) => (
                                        <div key={cl._id} className={`correction-exercise-list-item ${activeIndex === index ? 'active' : ''}`} onClick={() => selectStudent(cl._id)}>
                                            <div>
                                                {cl.student.name}
                                                ({cl.questionList.filter(q => q.answeredAt).length}/{cl.questionList.length})
                                                ({getCorrectNumber(cl)}/{cl.questionList.length})
                                                {
                                                    cl.correctionStatus === '1' && <span style={{ color: 'red' }}>(完)</span>
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
                <div className='correction-exercise-list-bot' onClick={onHandleFold}>
                    {
                        fold ? <div className='icon up'></div> : <div className='icon down'></div>
                    }
                </div>
            </div>
            {
                loading ? (
                    <Loader />
                ) : (
                    <Container>
                        <div>
                            {
                                questions.map((q, index) => {
                                    const question = q.question;
                                    return (
                                        <div className='question question-border' key={question._id}>
                                            <div className='question-title'>Question {index + 1}</div>
                                            <div className='question-level'>level: {question.difficuty}</div>
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
                                                                        name={q._id}
                                                                        checked={q.answer === 'E'}
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
                                                                        name={q._id}
                                                                        checked={q.answer.split(',').includes(option)}
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
                                                                        name={q._id}
                                                                        checked={q.answer.split(',').includes('E')}
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
                                                            value={q.answer}
                                                            disabled
                                                        />
                                                    </div>
                                                )
                                            }
                                            <div className='question-correct'>Correct Answer: {question.correctAnswer}</div>
                                            <div className='question-sub-title'>Corrections</div>
                                            {getCorrectResult(q)}
                                            <div style={{ border: '1px solid #ccc', zIndex: 100, marginTop: '20px' }}>
                                                {
                                                    editors.current[index] && (
                                                        <Toolbar
                                                            key={editorsKey[index]}
                                                            editor={editors.current[index]}
                                                            defaultConfig={toolbarConfig}
                                                            mode="default"
                                                            style={{ borderBottom: '1px solid #ccc' }}
                                                        />
                                                    )
                                                }
                                                {/* <Toolbar
                                                    editor={editors.current[index]}
                                                    defaultConfig={toolbarConfig}
                                                    mode="default"
                                                    style={{ borderBottom: '1px solid #ccc' }}
                                                /> */}
                                                <Editor
                                                    defaultConfig={editorConfig}
                                                    value={q.comments}
                                                    onCreated={editor => setEditor(editor, index)}
                                                    mode="default"
                                                    style={{ height: '300px', overflowY: 'hidden' }}
                                                />
                                            </div>
                                            <div className='question-correct-btn'>
                                                <Button disabled={q.loading || !q.answeredAt} onClick={() => submitComments(index)}>
                                                    { q.loading ? <Spinner animation="border" size="sm" /> : 'SUBMIT COMMENTS'}
                                                </Button>
                                            </div>
                                            <div className='question-sub-title'>Right/Wrong</div>
                                            <div className='question-correct-btn'>
                                                <Button disabled={!q.answeredAt} variant="success" style={{ marginRight: '10px' }} onClick={() => correct(true, index)}>Right</Button>
                                                <Button disabled={!q.answeredAt} variant="danger" onClick={() => correct(false, index)}>Wrong</Button>
                                            </div>
                                            {
                                                q.content && (q.content !== '<p><br></p>') && (
                                                    <div>
                                                        <div className='question-sub-title'>Answer content</div>
                                                        <div dangerouslySetInnerHTML={{ __html: q.content }}></div>
                                                    </div>
                                                )
                                            }
                                            <div className='question-solution'>
                                                <div className='question-sub-title'>Solution</div>
                                                <div className='question-content' dangerouslySetInnerHTML={{ __html: question.description }}></div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            {
                                <div className='question-finish-btn'>
                                    <Button variant={correctionStatus === '0' ? 'primary' : 'success'} className='mr-2' disabled={finishLoading || correctionStatus === '1'} onClick={finishCorrection}>
                                        {
                                            correctionStatus === '0' ? (
                                                finishLoading ? <Spinner animation="border" size="sm" /> : 'FINISH'
                                            ) : 'DONE'
                                        }
                                    </Button>
                                    {
                                        correctionStatus === '1' && (
                                            <Button onClick={openSendEmail}>SEND EMAIL</Button>
                                        )
                                    }
                                </div>
                            }
                        </div>
                    </Container>
                )
            }
            <Modal size="lg" show={sendEmailVisible} onHide={closeSendEmail}>
                <Modal.Header closeButton>
                    <Modal.Title>Send Email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            placeholder="Enter title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="content">
                        <Form.Label>Content</Form.Label>
                        <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                            <Toolbar
                                editor={emailEditor}
                                defaultConfig={toolbarConfig}
                                mode="default"
                                style={{ borderBottom: '1px solid #ccc' }}
                            />
                            <Editor
                                defaultConfig={editorConfig}
                                value={content}
                                onCreated={setEmailEditor}
                                onChange={editor => setContent(editor.getHtml())}
                                mode="default"
                                style={{ height: '500px', overflowY: 'hidden' }}
                            />
                        </div>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeSendEmail}>
                        Close
                    </Button>
                    <Button disabled={sendLoading} variant="primary" onClick={sendEmail}>
                        {sendLoading ? <Spinner animation="border" size="sm" /> : 'Send'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CorrectionExerciseScreen;