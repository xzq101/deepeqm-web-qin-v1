import React, { useEffect, useState, useRef } from "react";
import { Form, Button } from 'react-bootstrap';
import LibraryTree from "../components/LibraryTree";
import Loader from "../components/Loader";
import axios from "../utils/axios";
import Message from "../components/Message";

const options = ['A', 'B', 'C', 'D'];

export default function TeacherLibrary({ history }) {

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [sources, setSources] = useState([]);
    const [sourceId, setSourceId] = useState('');
    const libraryRef = useRef('');
    const chapterRef = useRef('');
    const sectionRef = useRef('');

    const getSources = () => {
        axios.get('/teacher/getSourceList').then(res => {
            setSources(res.result.list);
        });
    }

    const setLibrary = ({ library, chapter, section }) => {
        setLoading(true);
        libraryRef.current = library;
        chapterRef.current = chapter;
        sectionRef.current = section;
        axios.get('/teacher/getQuestionByLibrary', {
            params: {
                libraryId: library.id,
                chapterId: chapter.id,
                sectionId: section.id,
            }
        }).then(res => {
            setQuestions(res.result.list);
        }).finally(() => {
            setLoading(false);
        });
    }

    const searchQuestions = () => {
        setLoading(true);
        axios.get('/teacher/getQuestionByLibrary', {
            params: {
                libraryId: libraryRef.current.id,
                chapterId: chapterRef.current.id,
                sectionId: sectionRef.current.id,
                sourceId: sourceId
            }
        }).then(res => {
            setQuestions(res.result.list);
        }).finally(() => {
            setLoading(false);
        });
    }

    const linkEidt = (id) => {
        window.open(`/teach/question/${id}/edit`, '_blank');
    }

    useEffect(() => {
        getSources();
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <div className="library-left-content">
                <div className="library-left-tree">
                    <LibraryTree defaultSelected expandedAll onChange={setLibrary} />
                </div>
            </div>
            <div style={{ flex: 1, marginLeft: '10px' }}>
                <div>
                    <Form inline style={{ marginBottom: '10px' }}>
                        <Form.Group controlId="search">
                            {/* <Form.Control
                                className="mr-sm-3 ml-sm-6"
                                type="text"
                                name="name"
                                value={name}
                                onChange={e => setName (e.target.value)}
                                placeholder="Search By Source Name"
                            /> */}
                            <Form.Control
                                as="select"
                                style={{ width: '250px' }}
                                className="mr-sm-3 ml-sm-6"
                                defaultValue={sourceId}
                                onChange={e => setSourceId(e.target.value)}
                                custom
                            >
                                {
                                    sources.map((s, index) => (
                                        <option key={index} value={s._id}>{s.name}</option>
                                    ))
                                }
                            </Form.Control>
                            
                            <Button onClick={searchQuestions} variant="outline-success">
                                Search
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
                {
                    loading ? (<Loader />) : (
                        <div>
                            {
                                questions.length > 0 ?
                                    (
                                        questions.map((question, index) => {
                                            return (
                                                <div className='question question-border' key={question._id}>
                                                    <div className='question-title'>Question {index + 1}</div>
                                                    <div className='question-sub-title'>
                                                        {question.name}
                                                        <i className="question-edit fas fa-edit" onClick={() => linkEidt(question._id)} />
                                                    </div>
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
        </div>
    )
}