import React, { useState, useRef, useEffect } from "react";
import { Form, Modal, Button, Row, Col, Table, Spinner } from "react-bootstrap";
import Pagination from '@mui/lab/Pagination';
import Checkbox from '@mui/material/Checkbox';
import { useSnackbar } from 'notistack';
import LibraryTree from "../../../components/LibraryTree";
import axios from "../../../utils/axios";

function getLibraryText(data) {
    const { library, chapter, section } = data;
    const arr = [];
    if (library && library.id) {
        arr.push(library.name);
    }
    if (chapter && chapter.id) {
        arr.push(chapter.name);
    }
    if (section && section.id) {
        arr.push(section.name);
    }
    return arr.join(" / ");
}

const hotKey = navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? 'Command' : 'Ctrl';

export default function Settings() {
    const { enqueueSnackbar } = useSnackbar();
    const [libraryVisible, setLibraryVisible] = useState(false);
    const libraryTreeRef = useRef(null);
    const [librarySelectedIds, setLibrarySelectedIds] = useState([]);
    const [libraries, setLibraries] = useState([]);
    const [sources, setSources] = useState([]);
    const [sourceVisible, setSourceVisible] = useState(false);
    const [isClassroomStudent, setIsClassroomStudent] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [sourceList, setSourceList] = useState([]);
    const [selectedSource, setSelectedSource] = useState([]);
    const [difficulty, setDifficulty] = useState('');
    const [loading, setLoading] = useState(false);

    const getSettings = () => {
        axios.get('user/getUserSetting').then(res => {
            const { libraries, sources, difficulty, isClassroomStudent } = res.result;
            if (libraries.length > 0) {
                const data = libraries.map(item => {
                    const lib = item.libraryId;
                    const obj = {};
                    if (lib) {
                        obj.library = {
                            id: lib._id,
                            name: lib.name,
                        };
                        if (item.chapterId) {
                            const chapter = lib.chapter.find((x) => x._id === item.chapterId);
                            obj.chapter = {
                                id: chapter._id,
                                name: chapter.name,
                            };
                            if (item.sectionId) {
                                const section = chapter.section.find((x) => x._id === item.sectionId);
                                obj.section = {
                                    id: section._id,
                                    name: section.name,
                                };
                            }
                        }
                    }
                    return obj;
                });
                setLibraries(data);
            }
            if (sources.length > 0) {
                const data = sources.map(item => ({
                    id: item._id,
                    name: item.name,
                }));
                setSources(data);
            }
            setDifficulty(difficulty);
            setIsClassroomStudent(isClassroomStudent);
        });
    }

    const getSourceList = () => {
        axios.get('/user/getUserSource', {
            params: {
                page,
                keyword,
                pageSize,
            }
        }).then(res => {
            setSourceList(res.result.list);
            setTotal(res.result.total);
        })
    }



    const openLibraryModal = () => {
        const data = [];
        libraries.forEach(item => {
            const { library, chapter, section } = item;
            if (section && section.id) {
                data.push(section.id);
            } else if (chapter && chapter.id) {
                data.push(chapter.id);
            } else if (library && library.id) {
                data.push(library.id);
            }
        });
        setLibrarySelectedIds(data);
        setLibraryVisible(true);
    }

    const closeLibraryModal = () => {
        setLibraryVisible(false);
    }

    const selectLibrary = () => {
        const data = libraryTreeRef.current.getLibrarySelected();
        if (data.length === 0) {
            enqueueSnackbar('Please select library', { variant: 'error' })
            return;
        }
        setLibraries(data);
        setLibraryVisible(false);
    }

    const openSourceModal = () => {
        setSourceVisible(true);
        setSelectedSource([...sources]);
    }

    const closeSourceModal = () => {
        setSourceVisible(false);
    }

    const selecteSource = (item) => {
        const ids = selectedSource.map(s => s.id);
        if (ids.includes(item._id)) {
            setSelectedSource(selectedSource.filter(s => s.id !== item._id));
        } else {
            setSelectedSource([...selectedSource, {
                id: item._id,
                name: item.name,
            }]);
        }
    }

    const changePage = (event, value) => {
        setPage(value);
    }

    const searchSource = () => {
        if (page === 1) {
            getSourceList();
        } else {
            setPage(1);
        }
    }

    const selectSource = () => {
        setSourceVisible(false);
        setSources([...selectedSource]);
    }

    const save = () => {
        if (libraries.length === 0) {
            enqueueSnackbar('Please select library', { variant: 'error' })
            return;
        }
        if (sources.length === 0) {
            enqueueSnackbar('Please select source', { variant: 'error' })
            return;
        }
        setLoading(true);
        const libs = libraries.map(item => {
            const obj = {};
            if (item.library && item.library.id) {
                obj.libraryId = item.library.id;
            }
            if (item.chapter && item.chapter.id) {
                obj.chapterId = item.chapter.id;
            }
            if (item.section && item.section.id) {
                obj.sectionId = item.section.id;
            }
            return obj;
        });
        const data = {
            libraries: libs,
            sources: sources.map(item => item.id),
            difficulty,
        };
        axios.post('/user/updateUserSetting', data).then(res => {
            const questionTotal = res.result;
            enqueueSnackbar(`Save success, There are a total of ${questionTotal > 10 ? '10+' : questionTotal} questions in this setting`, { variant: 'success' })
        }).finally(() => {
            setLoading(false);
        });
    }


    useEffect(() => {
        getSettings();
    }, []);

    useEffect(() => {
        getSourceList();
    }, [page, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="resources-setting">
            <Form>
                <Form.Group controlId="library">
                    <Form.Label>Library</Form.Label>
                    <div className="form-library-control" onClick={openLibraryModal}>
                        {
                            libraries.map((item, index) => (
                                <div key={index}>
                                   {getLibraryText(item)}
                                </div>
                            ))
                        }
                    </div>
                </Form.Group>
                <Form.Group controlId="source">
                    <Form.Label>Source</Form.Label>
                    <div className="form-library-control" onClick={openSourceModal}>
                        {
                            sources.map((item, index) => (
                                <div key={index}>
                                    {item.name}
                                </div>
                            ))
                        }
                    </div>
                </Form.Group>
                <Form.Group controlId="difficulty">
                    <Form.Label>Difficulty</Form.Label>
                    <Form.Control as="select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="difficult">Difficult</option>
                        <option value="veryDifficult">Very difficult</option>
                        <option value="all">All</option>
                    </Form.Control>
                </Form.Group>
                <Form.Check
                    disabled
                    type="checkbox"
                    label="Classroom Student"
                    id="classroomStudent"
                    checked={isClassroomStudent}
                />
                <Button variant="primary" onClick={save} style={{ marginTop: '20px' }}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Save'}
                </Button>
            </Form>
            <Modal show={libraryVisible} onHide={closeLibraryModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Library</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ marginBottom: '20px' }}>
                        *Press {hotKey} key to multi-select
                    </div>
                    <LibraryTree multiSelect ref={libraryTreeRef} selected={librarySelectedIds} />
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
            <Modal show={sourceVisible} onHide={closeSourceModal} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Source</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="align-items-center">
                        <Col lg={8}>
                            <Form.Group controlId="search" style={{ display: 'flex' }}>
                                <Form.Control
                                    className="mr-sm-3 ml-sm-6"
                                    type="text"
                                    name="keyword"
                                    value={keyword}
                                    onChange={e => setKeyword(e.target.value)}
                                    placeholder="Search By NAME"
                                />
                                <Button size="sm" onClick={searchSource} variant="outline-success">
                                    Search
                                </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="mb-2">Selected: {selectedSource.map(s => s.name).join('、')}</div>
                    <Table striped bordered hover responsive className="source-table">
                        <thead>
                            <tr>
                                <th width={80}></th>
                                <th>name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                sourceList.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>
                                            <Checkbox disabled={item.expired} checked={selectedSource.map(s => s.id).includes(item._id)} onClick={() => selecteSource(item)} />
                                        </td>
                                        <td>{item.name}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                    <Pagination count={Math.ceil(total / pageSize)} page={page} onChange={changePage} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeSourceModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={selectSource} disabled={selectedSource.length === 0}>
                        Select
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}