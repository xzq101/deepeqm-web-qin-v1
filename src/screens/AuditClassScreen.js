import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Container, Modal, Form, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { getEditorConfig, toolbarConfig } from '../config/editor-config';
import Message from '../components/Message';
import Loader from '../components/Loader';
import axios from '../utils/axios';

const AuditClassScreen = ({ history, match }) => {

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [classDetail, setClassDetail] = useState({});
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(false);

    const [editor, setEditor] = useState(null);
    const [content, setContent] = useState('');
    const [contentLoading, setContentLoading] = useState(false);

    const editorConfig = getEditorConfig();

    const getClasses = () => {
        setLoading(true);
        axios.get('/admin/getAuditClasses', {
            params: {
                language: window.localStorage.getItem('lang') || 'en'
            }
        }).then(res => {
            setClasses(res.result.list);
            setLoading(false);
        }).catch(err => {
            setError(err.msg);
            setLoading(false);
        });
    }

    const setAudit = (detail) => {
        const { _id, isPublish } = detail;
        axios.post('/admin/auditClass', {
            id: _id,
            isPublish: isPublish === 2 ? 1 : 2,
        }).then(res => {
            getClasses();
        });
    }

    const setOrder = (detail) => {
        const { orderIndex } = detail;
        setClassDetail(detail);
        setIndex(orderIndex);
        openModal();
    }

    const audit = () => {
        const { _id, isPublish } = classDetail;
        axios.post('/admin/auditClass', {
            id: _id,
            isPublish,
            orderIndex: index,
        }).then(res => {
            getClasses();
            closeModal();
        });
    }

    const deleteClass = (detail) => {
        if (window.confirm('Are you sure')) {
            const { _id } = detail;
            axios.post('/admin/auditClass', {
                id: _id,
                isPublish: 0,
            }).then(res => {
                getClasses();
            });
        }
    }

    const openModal = () => {
        setVisible(true);
    }

    const closeModal = () => {
        setVisible(false);
    }

    const getHomeDetail = () => {
        axios.get('/public/getHomeDetail').then(res => {
            setContent(res.result.introduction);
        });
    }

    const setHomeDetail = () => {
        setContentLoading(true);
        axios.post('/admin/setHomeDetail', {
            introduction: content,
        }).then(res => {
            getHomeDetail();
            setContentLoading(false);
        }).catch(err => {
            setContentLoading(false);
        });
    }

    useEffect(() => {
        getClasses();
        getHomeDetail();
    }, []);

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
                    <h1>Audit Classes </h1>
                </Col>
            </Row>
            {loading
                ? <Loader />
                : error
                    ? <Message variant="danger">{error}</Message>
                    : <Container>
                        {
                            classes.length > 0 ?
                                (
                                    <Table striped bordered hover responsive className="table-sm">
                                        <thead>
                                            <tr>

                                                <th>NAME</th>
                                                <th>ORDER INDEX</th>
                                                <th>TEACHER NAME</th>
                                                <th>CATEGORY</th>
                                                <th>Start </th>
                                                <th>End </th>
                                                {/* <th>Add</th> */}
                                                <th>Audit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {classes.map(cl => (
                                                <tr key={cl._id}>
                                                    <td>{cl.name}</td>
                                                    <td>{cl.orderIndex}</td>
                                                    <td>{cl.user.name}</td>
                                                    <td>{cl.category}</td>
                                                    <td>{cl.startDate.split('T')[0]}</td>
                                                    <td>{cl.endDate.split('T')[0]}</td>
                                                    {/* <td>
                                                        <LinkContainer
                                                            to={`/teach/class/${cl._id}/addStudent`}
                                                        >
                                                            <Button variant="light" className="btn-sm">
                                                                Students
                                                            </Button>
                                                        </LinkContainer>
                                                        <LinkContainer
                                                            to={`/teach/class/${cl._id}/addContent`}
                                                        >
                                                            <Button variant="light" className="btn-sm">
                                                                Content
                                                            </Button>
                                                        </LinkContainer>
                                                    </td> */}
                                                    <td>
                                                        <Button variant="light" className="btn-sm" onClick={() => setAudit(cl)}>
                                                            <i className="fas fa-fire" style={{ color: cl.isPublish === 2 ? 'red' : '#FFE7A0' }} />
                                                        </Button>
                                                        <Button variant="light" className="btn-sm" onClick={() => setOrder(cl)}>
                                                            <i className="fas fa-sort" />
                                                        </Button>
                                                        <Button variant="danger" className="btn-sm" onClick={() => deleteClass(cl)}>
                                                            <i className="fas fa-trash" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) :
                                (
                                    <Message variant="info">
                                        No class found, change language or search again
                                    </Message>
                                )
                        }

                    </Container>}
            <Modal show={visible} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Set Order Index</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="index">
                        <Form.Label>Index</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter index"
                            value={index}
                            onChange={(e) => setIndex(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={audit}>
                        Audit
                    </Button>
                </Modal.Footer>
            </Modal>
            <Row className="align-items-center" style={{ marginTop: '30px' }}>
                <Col>
                    <h2>Home introduction </h2>
                </Col>
            </Row>
            <div style={{ border: '1px solid #ccc', zIndex: 100, margin: '20px 0' }}>
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
            <Button variant="primary" onClick={setHomeDetail}>
                {
                    contentLoading ? <Spinner animation="border" size="sm" /> : 'SAVE'
                }
            </Button>
        </Container>
    );
};

export default AuditClassScreen;
