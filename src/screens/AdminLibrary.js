import React, { useEffect, useState } from "react";
import { Container, Modal, Row, Col, Button, Form } from "react-bootstrap";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useSnackbar } from 'notistack';
import Message from "../components/Message";
import axios from "../utils/axios";
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { getEditorConfig, toolbarConfig } from '../config/editor-config';

function SectionRow(props) {
    const { row, libraryId, chapterId, openSectionModal, deleteSection, canUp, canDown, changeSectionOrder } = props;
    
    return (
        <TableRow key={row._id}>
            <TableCell></TableCell>
            <TableCell component="th" scope="row">{ row.name }</TableCell>
            <TableCell>
                <Button size="sm" className="mr-3" onClick={() => openSectionModal(libraryId, chapterId, row._id, row.name)}>
                    <i className="fas fa-edit" />
                </Button>
                {
                        canUp && (
                            <Button size="sm" className="mr-3" onClick={() => changeSectionOrder(libraryId, chapterId, row._id, 'up')}>
                                <i className="fas fa-arrow-up" />
                            </Button>
                        )
                    }
                    {
                        canDown && (
                            <Button size="sm" className="mr-3" onClick={() => changeSectionOrder(libraryId, chapterId, row._id, 'down')}>
                                <i className="fas fa-arrow-down" />
                            </Button>
                        )
                    }
                <Button size="sm" className="mr-3" variant="danger" onClick={() => deleteSection(libraryId, chapterId, row._id)}>
                    <i className="fas fa-trash" />
                </Button>
            </TableCell>
        </TableRow>
    )
}

function ChapterRow(props) {
    const { row, libraryId, openChatperModal, deleteChapter, openSectionModal, deleteSection, canUp, canDown, changeChapterOrder, changeSectionOrder } = props;

    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow key={row._id}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{ row.name }</TableCell>
                <TableCell>
                    <Button size="sm" className="mr-3" onClick={() => openSectionModal(libraryId, row._id)}>
                        <i className="fas fa-plus" /> Section
                    </Button>
                    <Button size="sm" className="mr-3" onClick={() => openChatperModal(libraryId, row._id, row.name)}>
                        <i className="fas fa-edit" />
                    </Button>
                    {
                        canUp && (
                            <Button size="sm" className="mr-3" onClick={() => changeChapterOrder(libraryId, row._id, 'up')}>
                                <i className="fas fa-arrow-up" />
                            </Button>
                        )
                    }
                    {
                        canDown && (
                            <Button size="sm" className="mr-3" onClick={() => changeChapterOrder(libraryId, row._id, 'down')}>
                                <i className="fas fa-arrow-down" />
                            </Button>
                        )
                    }
                    <Button size="sm" className="mr-3" variant="danger" onClick={() => deleteChapter(libraryId, row._id)}>
                        <i className="fas fa-trash" />
                    </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <TableContainer>
                            <Table aria-label="collapsible table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={100}></TableCell>
                                        <TableCell>Section Name</TableCell>
                                        <TableCell width={500}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        row.section.length > 0 ? (
                                            row.section.map((section, index) => (
                                                <SectionRow
                                                    libraryId={libraryId}
                                                    chapterId={row._id}
                                                    key={section._id}
                                                    row={section}
                                                    canUp={index > 0}
                                                    canDown={row.section.length - 1 !== index}
                                                    openSectionModal={openSectionModal}
                                                    deleteSection={deleteSection}
                                                    changeSectionOrder={changeSectionOrder} />
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3}>
                                                    <Message variant="info">
                                                        No section found
                                                    </Message>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

function LibraryRow(props) {
    const { row, canUp, canDown, openLibraryModal, deleteLibrary, openChatperModal, deleteChapter, openSectionModal, deleteSection, openTeacherModal, changeLibraryOrder, changeChapterOrder, changeSectionOrder } = props;
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow key={row._id}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.teacher ? row.teacher.name : ''}
                </TableCell>
                <TableCell>
                    <Button size="sm" className="mr-3" onClick={() => openChatperModal(row._id)}>
                        <i className="fas fa-plus" /> Chapter
                    </Button>
                    <Button size="sm" className="mr-3" onClick={() => openTeacherModal(row._id)}>
                        <i className="fas fa-plus" /> Teacher
                    </Button>
                    <Button size="sm" className="mr-3" onClick={() => openLibraryModal(row._id, row.name)}>
                        <i className="fas fa-edit" />
                    </Button>
                    {
                        canUp && (
                            <Button size="sm" className="mr-3" onClick={() => changeLibraryOrder(row._id, 'up')}>
                                <i className="fas fa-arrow-up" />
                            </Button>
                        )
                    }
                    {
                        canDown && (
                            <Button size="sm" className="mr-3" onClick={() => changeLibraryOrder(row._id, 'down')}>
                                <i className="fas fa-arrow-down" />
                            </Button>
                        )
                    }
                    <Button size="sm" className="mr-3" variant="danger" onClick={() => deleteLibrary(row._id)}>
                        <i className="fas fa-trash" />
                    </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <TableContainer>
                            <Table aria-label="collapsible table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={100}></TableCell>
                                        <TableCell>Chapter Name</TableCell>
                                        <TableCell width={500}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        row.chapter.length > 0 ? (
                                            row.chapter.map((chapter, index) => (
                                                <ChapterRow
                                                    libraryId={row._id}
                                                    key={chapter._id}
                                                    row={chapter}
                                                    canUp={index > 0}
                                                    canDown={row.chapter.length - 1 !== index}
                                                    openChatperModal={openChatperModal}
                                                    deleteChapter={deleteChapter}
                                                    openSectionModal={openSectionModal}
                                                    deleteSection={deleteSection}
                                                    changeChapterOrder={changeChapterOrder}
                                                    changeSectionOrder={changeSectionOrder} />
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4}>
                                                    <Message variant="info">
                                                        No chapter found
                                                    </Message>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

export default function AdminLibrary() {
    const { enqueueSnackbar } = useSnackbar();
    const [showLibrary, setShowLibrary] = useState(false);
    const [libraryId, setLibraryId] = useState(null);
    const [libraryName, setLibraryName] = useState('');
    const [libraryList, setLibraryList] = useState([]);
    const [showChatper, setShowChatper] = useState(false);
    const [chapterId, setChapterId] = useState(null);
    const [chapterName, setChapterName] = useState('');
    const [showSection, setShowSection] = useState(false);
    const [sectionId, setSectionId] = useState(null);
    const [sectionName, setSectionName] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [showTeacher, setShowTeacher] = useState(false);
    const [targetTeacher, setTargetTeacher] = useState({});

    const [editor, setEditor] = useState(null);
    const editorConfig = getEditorConfig();
    const [helpContent, setHelpContent] = useState('');
    const [maxQuestions, setMaxQuestions] = useState(0);

    const getLibrary = () => {
        axios.get("/user/getLibrary")
            .then((res) => {
                setLibraryList(res.result.list);
            })
    }

    const closeLibraryModal = () => {
        setShowLibrary(false);
    }

    const openLibraryModal = (id, name) => {
        setLibraryId(id);
        setShowLibrary(true);
        setLibraryName(name);
    }

    const editLibrary = () => {
        if (libraryId) {
            axios.post("/admin/updateLibrary", {
                id: libraryId,
                name: libraryName
            }).then((res) => {
                closeLibraryModal();
                getLibrary();
            })
        } else {
            axios.post("/admin/createLibrary", {
                name: libraryName
            }).then((res) => {
                closeLibraryModal();
                getLibrary();
            })
        }
    }

    const deleteLibrary = (id) => {
        if (window.confirm("Are you sure to delete this library?")) {
            axios.post("/admin/deleteLibrary", {
                id
            }).then((res) => {
                closeLibraryModal();
                getLibrary();
            }).catch(res => {
                enqueueSnackbar(res.msg, { variant: 'error' });
            })
        }
    }

    const closeChatperModal = () => {
        setShowChatper(false);
    }

    const openChatperModal = (libraryId, id, name) => {
        setChapterId(id);
        setShowChatper(true);
        setChapterName(name);
        setLibraryId(libraryId);
    }

    const editChatper = () => {
        if (chapterId) {
            axios.post("/admin/updateChapter", {
                chapterId: chapterId,
                libraryId,
                name: chapterName
            }).then((res) => {
                closeChatperModal();
                getLibrary();
            });
        } else {
            axios.post("/admin/createChapter", {
                name: chapterName,
                libraryId,
            }).then((res) => {
                closeChatperModal();
                getLibrary();
            });
        }
    }

    const deleteChapter = (libraryId, chapterId) => {
        if (window.confirm("Are you sure to delete this chapter?")) {
            axios.post("/admin/deleteChapter", {
                chapterId,
                libraryId
            }).then((res) => {
                closeChatperModal();
                getLibrary();
            }).catch(res => {
                enqueueSnackbar(res.msg, { variant: 'error' });
            })
        }
    }

    const openSectionModal = (libraryId, chapterId, id, name) => {
        setSectionId(id);
        setShowSection(true);
        setSectionName(name);
        setChapterId(chapterId);
        setLibraryId(libraryId);
    }

    const closeSectionModal = () => {
        setShowSection(false);
    }

    const editSection = () => {
        if (sectionId) {
            axios.post("/admin/updateSection", {
                sectionId: sectionId,
                chapterId,
                libraryId,
                name: sectionName
            }).then((res) => {
                closeSectionModal();
                getLibrary();
            });
        } else {
            axios.post("/admin/createSection", {
                name: sectionName,
                chapterId,
                libraryId,
            }).then((res) => {
                closeSectionModal();
                getLibrary();
            });
        }
    }

    const deleteSection = (libraryId, chapterId, sectionId) => {
        if (window.confirm("Are you sure to delete this section?")) {
            axios.post("/admin/deleteSection", {
                sectionId,
                chapterId,
                libraryId
            }).then((res) => {
                closeSectionModal();
                getLibrary();
            }).catch(res => {
                enqueueSnackbar(res.msg, { variant: 'error' });
            })
        }
    }

    const openTeacherModal = (libraryId) => {
        setShowTeacher(true);
        setLibraryId(libraryId);
        const library = libraryList.find(item => item._id === libraryId);
        if (library) {
            setTargetTeacher(library.teacher);
        }
    }

    const closeTeacheModal = () => {
        setShowTeacher(false);
    }

    const getTeachers = () => {
        axios.get("/admin/getTeachers")
            .then((res) => {
                setTeachers(res.result.list);
            })
    }

    const bindTeacher = (id) => {
        axios.post("/admin/bindTeacherToLibrary", {
            teacherId: id,
            libraryId
        }).then(() => {
            getLibrary();
            closeTeacheModal();
        })
    }

    const unbindTeacher = (id) => {
        axios.post("/admin/unbindTeacherToLibrary", {
            teacherId: id,
            libraryId
        }).then(() => {
            setTargetTeacher({});
            getLibrary();
        })
    }

    const changeLibraryOrder = (id, type) => {
        axios.post("/admin/changeLibraryOrder", {
            libraryId: id,
            type,
        }).then(() => {
            getLibrary();
        });
    }

    const getHelpContent = () => {
        axios.get('/public/getResourceBase').then(res => {
            const { helpContent: content, maxQuestions: max } = res.result;
            setHelpContent(content);
            setMaxQuestions(max);
        });
    }

    const saveHelpContent = () => {
        axios.post('/admin/editResourceBase', {
            helpContent
        }).then(res => {
            enqueueSnackbar('Successfully saved', { variant: 'success' });
        });
    }

    const saveMaxQuestions = () => {
        // 正则判断是否是数字
        if (!/^[0-9]*$/.test(maxQuestions)) {
            enqueueSnackbar('Please enter a number', { variant: 'error' });
            return;
        }
        axios.post('/admin/editResourceBase', {
            maxQuestions,
        }).then(res => {
            enqueueSnackbar('Successfully saved', { variant: 'success' });
        });
    }

    const changeChapterOrder = (libraryId, chapterId, type) => {
        console.log(libraryId, chapterId, type);
        axios.post("/admin/changeChapterOrder", {
            libraryId,
            chapterId,
            type,
        }).then(() => {
            getLibrary();
        });
    }

    const changeSectionOrder = (libraryId, chapterId, sectionId, type) => {
        console.log(libraryId, chapterId, sectionId, type);
        axios.post("/admin/changeSectionOrder", {
            libraryId,
            chapterId,
            sectionId,
            type,
        }).then(() => {
            getLibrary();
        });
    }


    useEffect(() => {
        getLibrary();
        getTeachers();
        getHelpContent();
        // eslint-disable-next-line
    }, []); 

    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor]);

    return (
        <Container>
            <Row className="align-items-center">
                <Col>
                    <h1>Library </h1>
                </Col>
                <Col className="text-right">
                    <Button className="my-3" onClick={() => openLibraryModal()}>
                        <i className="fas fa-plus" /> Create New Library
                    </Button>
                </Col>
            </Row>
            <Container>
                <TableContainer>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell width={100}></TableCell>
                                <TableCell>Library Name</TableCell>
                                <TableCell>Teacher</TableCell>
                                <TableCell width={500}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                libraryList.length > 0 ? (
                                    libraryList.map((row, index) => (
                                        <LibraryRow
                                            key={row._id}
                                            row={row}
                                            canUp={index > 0}
                                            canDown={libraryList.length - 1 !== index}
                                            openLibraryModal={openLibraryModal}
                                            deleteLibrary={deleteLibrary}
                                            openChatperModal={openChatperModal}
                                            deleteChapter={deleteChapter}
                                            openSectionModal={openSectionModal}
                                            deleteSection={deleteSection}
                                            openTeacherModal={openTeacherModal}
                                            changeLibraryOrder={changeLibraryOrder}
                                            changeChapterOrder={changeChapterOrder}
                                            changeSectionOrder={changeSectionOrder} />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <Message variant="info">
                                                No library found
                                            </Message>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{ marginTop: '60px' }}>
                    <h2>Resources Setting</h2>
                    <h4 style={{ marginTop: '40px' }}>Help</h4>
                    <div style={{ border: '1px solid #ccc', zIndex: 100, marginTop: '20px', marginBottom: '20px' }}>
                        <Toolbar
                            editor={editor}
                            defaultConfig={toolbarConfig}
                            mode="default"
                            style={{ borderBottom: '1px solid #ccc' }}
                        />
                        <Editor
                            defaultConfig={editorConfig}
                            value={helpContent}
                            onCreated={setEditor}
                            onChange={editor => setHelpContent(editor.getHtml())}
                            mode="default"
                            style={{ height: '300px', overflowY: 'hidden' }}
                        />
                    </div>
                    <Button onClick={saveHelpContent}>Save</Button>
                    <h4 style={{ marginTop: '40px' }}>Max Resources</h4>
                    <div style={{ display: 'flex' }}>
                        <Form.Control style={{ width: '200px', marginRight: '4px' }} type="input" value={maxQuestions} onChange={(e) => setMaxQuestions(e.target.value)} />
                        <Button onClick={saveMaxQuestions}>Save</Button>
                    </div>
                    
                </div>
            </Container>
            <Modal show={showLibrary} onHide={closeLibraryModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{ libraryId ? 'Eidt' : 'Create'} Library</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="name">
                        <Form.Label>Library Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter library name"
                            value={libraryName}
                            onChange={(e) => setLibraryName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeLibraryModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editLibrary}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showChatper} onHide={closeChatperModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{ chapterId ? 'Eidt' : 'Create'} Chatper</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="name">
                        <Form.Label>Chatper Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter chapter name"
                            value={chapterName}
                            onChange={(e) => setChapterName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeChatperModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editChatper}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showSection} onHide={closeSectionModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{ sectionId ? 'Eidt' : 'Create'} Section</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="name">
                        <Form.Label>Section Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter section name"
                            value={sectionName}
                            onChange={(e) => setSectionName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeSectionModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editSection}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showTeacher} onHide={closeTeacheModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Teacher</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover responsive className="table-sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>ID</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {
                                teachers.map((teacher) => (
                                    <tr key={teacher.id}>
                                        <td>{teacher.name}</td>
                                        <td>{teacher._id}</td>
                                        <td>
                                            {
                                                targetTeacher && targetTeacher._id === teacher._id ? (
                                                    <Button variant="primary" onClick={() => unbindTeacher(teacher._id)}>Unbind</Button>
                                                ) : (
                                                    <Button variant="primary" onClick={() => bindTeacher(teacher._id)}>Bind</Button>
                                                )
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </Container>
    );
}