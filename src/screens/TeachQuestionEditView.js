import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Form, Table, Button, Row, Col, Container, Modal, Spinner } from "react-bootstrap";
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import Message from "../components/Message";
import { getEditorConfig, toolbarConfig } from '../config/editor-config';
import "react-datepicker/dist/react-datepicker.css";
import axios from "../utils/axios";
import LibraryTree from "../components/LibraryTree";
import SourceModal from "../components/SourceModal";


const isChoiceMap = {
    0: 'Single Select Multiple Choice Question',
    1: 'Multiple Select Multiple Choice Question',
    2: 'Free Response Question',
}

const options = ['A', 'B', 'C', 'D'];

const TeachQuestionEditView = ({ history, match }) => {
    const questionId = match.params.id;

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [qText, setQText] = useState("");
    const [image, setImage] = useState("");
    const [showImg, setShowImg] = useState(false);
    const [isChoice, setIsChoice] = useState("");
    const [numChoice, setNumChoice] = useState("4");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [difficuty, setDifficuty] = useState(3);
    const [description, setDescription] = useState("");
    const [source, setSource] = useState("");
    const [copyright, setCopyright] = useState(false);
    const [answerA, setAnswerA] = useState("");
    const [answerB, setAnswerB] = useState("");
    const [answerC, setAnswerC] = useState("");
    const [answerD, setAnswerD] = useState("");
    const [answerE, setAnswerE] = useState("");
    const [language, setLanguage] = useState("en");

    const [editorContent, setEditorContent] = useState(null);
    const [editorDescription, setEditorDescription] = useState(null);
    const [editorAnswerA, setEditorAnswerA] = useState(null);
    const [editorAnswerB, setEditorAnswerB] = useState(null);
    const [editorAnswerC, setEditorAnswerC] = useState(null);
    const [editorAnswerD, setEditorAnswerD] = useState(null);
    const [editorAnswerE, setEditorAnswerE] = useState(null);
    const [referenceId, setReferenceId] = useState(null);
    const [libraryId, setLibraryId] = useState(null);
    const [chapterId, setChapterId] = useState(null);
    const [sectionId, setSectionId] = useState(null);
    const [libraryName, setLibraryName] = useState("");
    const [chapterName, setChapterName] = useState("");
    const [sectionName, setSectionName] = useState("");
    const [librarySelectedId, setLibrarySelectedId] = useState(null);

    const [visible, setVisible] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [errorUpdate, setErrorUpdate] = useState("");
    const [libraryVisible, setLibraryVisible] = useState(false);
    const libraryTreeRef = useRef();

    const [sourceVisible, setSourceVisible] = useState(false);
    const [sourceName, setSourceName] = useState("");

    const setLibraryNames = (libraryId, chapterId, sectionId) => {
        if (libraryId) {
            setLibraryName(libraryId.name);
            if (chapterId) {
                const chapter = libraryId.chapter.find((x) => x._id === chapterId);
                if (chapter) {
                    setChapterName(chapter.name);
                    if (sectionId) {
                        const section = chapter.section.find((x) => x._id === sectionId);
                        if (section) {
                            setSectionName(section.name);
                        }
                    }
                }
            }
        }
    }

    const getQuestionDetail = () => {
        axios.post(`/teacher/getQuestionById`, { id: questionId })
            .then(res => {
                const question = res.result;
                if (question.referenceId && window.localStorage.getItem('lang') !== question.language) {
                    history.replace(`/teach/question/${question.referenceId}/edit`);
                    return;
                }
                setName(question.name);
                setCategory(question.category);
                setQText(question.qText);
                setImage(question.image);
                setShowImg(question.showImg);
                setIsChoice(question.isChoice);
                setNumChoice(question.numChoice);
                setCorrectAnswer(question.correctAnswer);
                setDifficuty(question.difficuty);
                setDescription(question.description);
                if (question.source) {
                    setSourceName(question.source.name);
                    setSource(question.source._id);
                }
                setCopyright(question.copyright);
                setAnswerA(question.answerA);
                setAnswerB(question.answerB);
                setAnswerC(question.answerC);
                setAnswerD(question.answerD);
                setAnswerE(question.answerE);
                setLanguage(question.language);
                setReferenceId(question.referenceId);
                setLibraryId(question.libraryId ? question.libraryId._id : null);
                setChapterId(question.chapterId);
                setSectionId(question.sectionId);

                setLibraryNames(question.libraryId, question.chapterId, question.sectionId);
            })
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (libraryId && !chapterId && !sectionId) {
            setErrorUpdate("Please select chapter and section");
            return;
        }
        const updateQ = {
            _id: questionId,
            name,
            category,
            qText,
            image,
            showImg,
            isChoice,
            numChoice,
            correctAnswer,
            difficuty,
            description,
            source,
            copyright,
            answerA,
            answerB,
            answerC,
            answerD,
            answerE,
            language,
            referenceId,
            libraryId,
            chapterId,
            sectionId,
        };
        // dispatch(updateQuestion(updateQ));
        setLoadingUpdate(true);
        setErrorUpdate("");
        axios.put(`/teacher/updateQuestion`, updateQ)
            .then(res => {
                setLoadingUpdate(false);
            })
            .catch(err => {
                console.log(err);
                setErrorUpdate(err.msg);
                setLoadingUpdate(false);
            });
    };

    const editorConfig = getEditorConfig();

    useEffect(() => {
        return () => {
            if (editorContent == null) return;
            editorContent.destroy();
            setEditorContent(null);
        }
    }, [editorContent]);

    useEffect(() => {
        return () => {
            if (editorDescription == null) return;
            editorDescription.destroy();
            setEditorDescription(null);
        }
    }, [editorDescription]);

    useEffect(() => {
        return () => {
            if (editorAnswerA == null) return;
            editorAnswerA.destroy();
            setEditorAnswerA(null);
        }
    }, [editorAnswerA]);

    useEffect(() => {
        return () => {
            if (editorAnswerB == null) return;
            editorAnswerB.destroy();
            setEditorAnswerB(null);
        }
    }, [editorAnswerB]);

    useEffect(() => {
        return () => {
            if (editorAnswerC == null) return;
            editorAnswerC.destroy();
            setEditorAnswerC(null);
        }
    }, [editorAnswerC]);

    useEffect(() => {
        return () => {
            if (editorAnswerD == null) return;
            editorAnswerD.destroy();
            setEditorAnswerD(null);
        }
    }, [editorAnswerD]);

    useEffect(() => {
        return () => {
            if (editorAnswerE == null) return;
            editorAnswerE.destroy();
            setEditorAnswerE(null);
        }
    }, [editorAnswerE]);

    const closePreviewModal = () => {
        setVisible(false);
    }

    const openPreviewModal = () => {
        setVisible(true);
    }

    const openLibraryModal = () => {
        if (sectionId) {
            setLibrarySelectedId(sectionId);
        } else if (chapterId) {
            setLibrarySelectedId(chapterId);
        } else if (libraryId) {
            setLibrarySelectedId(libraryId);
        } else {
            setLibrarySelectedId(null);
        }
        setLibraryVisible(true);

    }

    const closeLibraryModal = () => {
        setLibraryVisible(false);
    }

    const selectLibrary = () => {
        const { library, chapter, section } = libraryTreeRef.current.getLibrarySelected();
        setLibraryId(library.id);
        setChapterId(chapter.id);
        setSectionId(section.id);
        setLibraryName(library.name);
        setChapterName(chapter.name);
        setSectionName(section.name);
        setLibraryVisible(false);
    }

    useEffect(() => {
        getQuestionDetail();
    }, [questionId]);

    const closeSourceModal = () => {
        setSourceVisible(false);
    }

    const openSourceModal = () => {
        setSourceVisible(true);
    }

    const selectSource = (item) => {
        setSource(item.id);
        setSourceName(item.name);
        setSourceVisible(false);
    }

    return (
        <Container>
            <Link to="/teach/questionlist" className="btn btn-light my-3">
                Go Back
            </Link>
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <h2> Edit Question </h2>
                    {/* {(loadingUpdate || loading) && <Loader />} */}
                    {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="language">
                            <Form.Label>Language</Form.Label>
                            <Form.Control
                                as="select"
                                value={language}
                                onChange={e => setLanguage(e.target.value)}
                            >
                                <option>{language}</option>
                                <option value="en">en</option>
                                <option value="zh">zh</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="category"
                                placeholder="Enter category"
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="qtext">
                            <Form.Label>Question Content</Form.Label>
                            {/* <Form.Control
                                    as="textarea"
                                    rows={5}
                                    value={qText}
                                    onChange={(e) => setQText(e.target.value)}
                                /> */}
                            <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                                <Toolbar
                                    editor={editorContent}
                                    defaultConfig={toolbarConfig}
                                    mode="default"
                                    style={{ borderBottom: '1px solid #ccc' }}
                                />
                                <Editor
                                    defaultConfig={editorConfig}
                                    value={qText}
                                    onCreated={setEditorContent}
                                    onChange={editor => setQText(editor.getHtml())}
                                    mode="default"
                                    style={{ height: '500px', overflowY: 'hidden' }}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group controlId="isChoice">
                            <Form.Label>{`Is Single, Multi Select Choice Question or Free Response Question?`}</Form.Label>
                            <Form.Control
                                as="select"
                                defaultValue={isChoice}
                                onChange={(e) =>
                                    setIsChoice(e.target.value)
                                }
                                custom
                            >
                                <option>{isChoiceMap[isChoice]}</option>
                                <option value="0">
                                    Single Select Multiple Choice Question
                                </option>
                                <option value="1">
                                    Multi select Multiple Choice Question
                                </option>
                                <option value="2">
                                    Free Response Question
                                </option>
                            </Form.Control>
                        </Form.Group>

                        {(isChoice === "0" || isChoice === "1") ? (
                            <Form.Group controlId="numChoice">
                                <Form.Label>{`Set number of Choices:`}</Form.Label>
                                <Form.Control
                                    as="select"
                                    defaultValue={numChoice}
                                    onChange={(e) =>
                                        setNumChoice(e.target.value)
                                    }
                                    custom
                                >
                                    <option>{numChoice}</option>

                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </Form.Control>
                            </Form.Group>
                        ) : (
                            <div />
                        )}
                        <Form.Group controlId="answerA" style={{ display: (isChoice === "0" || isChoice === "1") ? 'block' : 'none' }}>
                            <Form.Label>Answer A</Form.Label>
                            <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                                <Toolbar
                                    editor={editorAnswerA}
                                    defaultConfig={toolbarConfig}
                                    mode="default"
                                    style={{ borderBottom: '1px solid #ccc' }}
                                />
                                <Editor
                                    defaultConfig={editorConfig}
                                    value={answerA}
                                    onCreated={setEditorAnswerA}
                                    onChange={editor => setAnswerA(editor.getHtml())}
                                    mode="default"
                                    style={{ height: '200px', overflowY: 'hidden' }}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group controlId="answerB" style={{ display: (isChoice === "0" || isChoice === "1") ? 'block' : 'none' }}>
                            <Form.Label>Answer B</Form.Label>
                            <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                                <Toolbar
                                    editor={editorAnswerB}
                                    defaultConfig={toolbarConfig}
                                    mode="default"
                                    style={{ borderBottom: '1px solid #ccc' }}
                                />
                                <Editor
                                    defaultConfig={editorConfig}
                                    value={answerB}
                                    onCreated={setEditorAnswerB}
                                    onChange={editor => setAnswerB(editor.getHtml())}
                                    mode="default"
                                    style={{ height: '200px', overflowY: 'hidden' }}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group controlId="answerC" style={{ display: (isChoice === "0" || isChoice === "1") ? 'block' : 'none' }}>
                            <Form.Label>Answer C</Form.Label>
                            <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                                <Toolbar
                                    editor={editorAnswerC}
                                    defaultConfig={toolbarConfig}
                                    mode="default"
                                    style={{ borderBottom: '1px solid #ccc' }}
                                />
                                <Editor
                                    defaultConfig={editorConfig}
                                    value={answerC}
                                    onCreated={setEditorAnswerC}
                                    onChange={editor => setAnswerC(editor.getHtml())}
                                    mode="default"
                                    style={{ height: '200px', overflowY: 'hidden' }}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group controlId="answerD" style={{ display: (isChoice === "0" || isChoice === "1") ? 'block' : 'none' }}>
                            <Form.Label>Answer D</Form.Label>
                            <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                                <Toolbar
                                    editor={editorAnswerD}
                                    defaultConfig={toolbarConfig}
                                    mode="default"
                                    style={{ borderBottom: '1px solid #ccc' }}
                                />
                                <Editor
                                    defaultConfig={editorConfig}
                                    value={answerD}
                                    onCreated={setEditorAnswerD}
                                    onChange={editor => setAnswerD(editor.getHtml())}
                                    mode="default"
                                    style={{ height: '200px', overflowY: 'hidden' }}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group controlId="answerE" style={{
                            display: (isChoice === "0" || isChoice === "1") &&
                                numChoice > 4 ? 'block' : 'none'
                        }}>
                            <Form.Label>Answer E</Form.Label>
                            <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                                <Toolbar
                                    editor={editorAnswerE}
                                    defaultConfig={toolbarConfig}
                                    mode="default"
                                    style={{ borderBottom: '1px solid #ccc' }}
                                />
                                <Editor
                                    defaultConfig={editorConfig}
                                    value={answerE}
                                    onCreated={setEditorAnswerE}
                                    onChange={editor => setAnswerE(editor.getHtml())}
                                    mode="default"
                                    style={{ height: '200px', overflowY: 'hidden' }}
                                />
                            </div>
                        </Form.Group>

                        {isChoice ===
                            "0" ? (
                            <Form.Group controlId="correctAnswer">
                                <Form.Label>{`Set Correct Answer:`}</Form.Label>
                                <Form.Control
                                    as="select"
                                    defaultValue={correctAnswer}
                                    onChange={(e) =>
                                        setCorrectAnswer(e.target.value)
                                    }
                                    custom
                                >
                                    <option>{correctAnswer}</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                    {numChoice > 4 && (
                                        <option value="E">E</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        ) : (
                            <div />
                        )}
                        {isChoice ===
                            "1" ? (
                            <Form.Group controlId="correctAnswer">
                                <Form.Label>{`Set Correct Answer:`}</Form.Label>
                                <Form.Control
                                    type="correctAnswer"
                                    placeholder="Enter correctAnswer，e.g. A,B,C,D"
                                    value={correctAnswer}
                                    onChange={(e) =>
                                        setCorrectAnswer(e.target.value)
                                    }
                                />
                            </Form.Group>
                        ) : (
                            <div />
                        )}

                        {isChoice === "2" ? (
                            <Form.Group controlId="correctAnswerf">
                                <Form.Label>Correct Answer</Form.Label>
                                <Form.Control
                                    type="correctAnswer"
                                    placeholder="Enter correctAnswer"
                                    value={correctAnswer}
                                    onChange={(e) =>
                                        setCorrectAnswer(e.target.value)
                                    }
                                />
                            </Form.Group>
                        ) : (
                            <div />
                        )}

                        <Form.Group controlId="difficuty">
                            <Form.Label>{`Set difficuty:`}</Form.Label>
                            <Form.Control
                                as="select"
                                defaultValue={difficuty}
                                onChange={(e) =>
                                    setDifficuty(e.target.value)
                                }
                                custom
                            >
                                <option>{difficuty}</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Solution</Form.Label>
                            {/* <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                /> */}
                            <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                                <Toolbar
                                    editor={editorDescription}
                                    defaultConfig={toolbarConfig}
                                    mode="default"
                                    style={{ borderBottom: '1px solid #ccc' }}
                                />
                                <Editor
                                    defaultConfig={editorConfig}
                                    value={description}
                                    onCreated={setEditorDescription}
                                    onChange={editor => setDescription(editor.getHtml())}
                                    mode="default"
                                    style={{ height: '500px', overflowY: 'hidden' }}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group controlId="source">
                            <Form.Label>Source</Form.Label>
                            {/* <Form.Control
                                type="source"
                                placeholder="Enter Source"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                            /> */}
                            <div className="form-library-control" onClick={openSourceModal}>
                                <div>{sourceName}</div>
                            </div>
                        </Form.Group>
                        <Form.Group controlId="library" style={{ position: 'relative' }}>
                            <Form.Label>Library</Form.Label>
                            <div className="form-library-control" onClick={openLibraryModal}>
                                <div>library: {libraryName}</div>
                                <div>chapter: {chapterName}</div>
                                <div>section: {sectionName}</div>
                            </div>
                        </Form.Group>

                        <Form.Group controlId="referenceId">
                            <Form.Label>ReferenceId</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter ReferenceId"
                                value={referenceId}
                                onChange={(e) => setReferenceId(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="copyright">
                            <Form.Check
                                type="checkbox"
                                label="Has copyright or not"
                                checked={copyright}
                                onChange={(e) =>
                                    setCopyright(e.target.checked)
                                }
                            />
                        </Form.Group>

                        <Button type="submit" variant="primary" style={{ marginRight: '10px' }} disabled={loadingUpdate}>
                            {
                                loadingUpdate ? <Spinner animation="border" size="sm" /> : 'Update'
                            }
                        </Button>
                        <Button variant="primary" onClick={openPreviewModal}>
                            Preview
                        </Button>
                    </Form>
                </Col>
            </Row>
            <Modal show={visible} onHide={closePreviewModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='question' style={{ paddingBottom: '30px' }}>
                        <div className='question-title'>{name}</div>
                        <div className='question-level'>level: {difficuty}</div>
                        <div className='question-content' dangerouslySetInnerHTML={{ __html: qText }}></div>
                        {
                            (isChoice === '0' || isChoice === '1') && (
                                <div className='question-options'>
                                    <Form.Check type={isChoice === '0' ? 'radio' : 'checkbox'}>
                                        <Form.Check.Input
                                            type={isChoice === '0' ? 'radio' : 'checkbox'}
                                            id="answerA" />
                                        <Form.Check.Label for="answerA">
                                            <div className='question-option'>
                                                <div className='label'>A. </div>
                                                <div className='value' dangerouslySetInnerHTML={{
                                                    __html
                                                        : answerA
                                                }}></div>
                                            </div>
                                        </Form.Check.Label>
                                    </Form.Check>
                                    <Form.Check type={isChoice === '0' ? 'radio' : 'checkbox'}>
                                        <Form.Check.Input
                                            type={isChoice === '0' ? 'radio' : 'checkbox'}
                                            id="answerB" />
                                        <Form.Check.Label for="answerB">
                                            <div className='question-option'>
                                                <div className='label'>A. </div>
                                                <div className='value' dangerouslySetInnerHTML={{
                                                    __html
                                                        : answerB
                                                }}></div>
                                            </div>
                                        </Form.Check.Label>
                                    </Form.Check>
                                    <Form.Check type={isChoice === '0' ? 'radio' : 'checkbox'}>
                                        <Form.Check.Input
                                            type={isChoice === '0' ? 'radio' : 'checkbox'}
                                            id="answerC" />
                                        <Form.Check.Label for="answerC">
                                            <div className='question-option'>
                                                <div className='label'>C. </div>
                                                <div className='value' dangerouslySetInnerHTML={{
                                                    __html
                                                        : answerC
                                                }}></div>
                                            </div>
                                        </Form.Check.Label>
                                    </Form.Check>
                                    <Form.Check type={isChoice === '0' ? 'radio' : 'checkbox'}>
                                        <Form.Check.Input
                                            type={isChoice === '0' ? 'radio' : 'checkbox'}
                                            id="answerD" />
                                        <Form.Check.Label for="answerD">
                                            <div className='question-option'>
                                                <div className='label'>D. </div>
                                                <div className='value' dangerouslySetInnerHTML={{
                                                    __html
                                                        : answerD
                                                }}></div>
                                            </div>
                                        </Form.Check.Label>
                                    </Form.Check>
                                    {
                                        Number(numChoice) > 4 && (
                                            <Form.Check type={isChoice === '0' ? 'radio' : 'checkbox'}>
                                                <Form.Check.Input
                                                    type={isChoice === '0' ? 'radio' : 'checkbox'}
                                                    id="answerE" />
                                                <Form.Check.Label for="answerE">
                                                    <div className='question-option'>
                                                        <div className='label'>E.</div>
                                                        <div className='value' dangerouslySetInnerHTML={{
                                                            __html
                                                                : answerE
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
                            isChoice === '2' && (
                                <div className='question-textarea'>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                    />
                                </div>
                            )
                        }
                        <div className='question-correct'>Correct Answer: {correctAnswer}</div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={libraryVisible} onHide={closeLibraryModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Library</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LibraryTree ref={libraryTreeRef} selected={librarySelectedId} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeLibraryModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={selectLibrary}>
                        Select
                    </Button>
                </Modal.Footer>
            </Modal>
            <SourceModal
                show={sourceVisible}
                handleClose={closeSourceModal}
                handleSave={selectSource} />
        </Container>
    );
};

export default TeachQuestionEditView;
