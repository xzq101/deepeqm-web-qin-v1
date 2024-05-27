import React, { useState, useEffect } from 'react';
import { Form, Table, Button, Row, Col, Container, Modal, Spinner } from "react-bootstrap";
import { useSnackbar } from 'notistack';
import Pagination from '@mui/lab/Pagination';
import Checkbox from '@mui/material/Checkbox';
import axios from '../utils/axios';

export default function SourceModal(props) {
    const { show, handleClose, handleSave } = props;

    const { enqueueSnackbar } = useSnackbar();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const [source, setSource] = useState({});
    const [sourceList, setSourceList] = useState([]);
    const [selectedSource, setSelectedSource] = useState({});

    const getSourceList = () => {
        axios.get('/teacher/getSourceList', {
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

    const openCreateSource = (currentSource = {}) => {
        setVisible(true);
        setSource(currentSource);
        setName(currentSource.name || '');
    }

    const searchSource = () => {
        if (page === 1) {
            getSourceList();
        } else {
            setPage(1);
        }
    }

    const updateSource = () => {
        if (source.id) {
            axios.post('/teacher/updateSource', {
                id: source.id,
                name
            }).then(res => {
                setVisible(false);
                getSourceList();
            });
        } else {
            axios.post('/teacher/createSource', {
                name
            }).then(res => {
                setVisible(false);
                getSourceList();
            });
        }
    }

    const deleteSource = (id) => {
        if (window.confirm('Are you sure')) {
            axios.post('/teacher/deleteSource', {
                id
            }).then(res => {
                getSourceList();
            }).catch((err) => {
                enqueueSnackbar(err.msg, { variant: 'error' })
            })
        }
    }

    const changePage = (event, value) => {
        setPage(value);
    }

    const selecteSource = (item) => {
        setSelectedSource({
            id: item._id,
            name: item.name
        });
    }

    useEffect(() => {
        getSourceList();
    }, [page, pageSize]); // eslint-disable-line

    return (
        <Modal show={show} onHide={handleClose} size='lg'>
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
                    <Col lg={4} className="text-right">
                        <Button size="sm" className="my-3" onClick={openCreateSource}>
                            <i className="fas fa-plus" /> Create Source
                        </Button>
                    </Col>
                </Row>
                <Table striped bordered hover responsive className="source-table">
                    <thead>
                        <tr>
                            <th width={80}></th>
                            <th>name</th>
                            <th width={180}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sourceList.map((item, index) => (
                                <tr key={item._id}>
                                    <td>
                                        <Checkbox checked={item._id === selectedSource.id} onClick={() => selecteSource(item)} />
                                    </td>
                                    <td>{item.name}</td>
                                    <td>
                                        <Button size="sm" variant="primary" onClick={() => openCreateSource({ id: item._id, name: item.name})}>
                                            <i className="fas fa-edit" />
                                        </Button>
                                        <Button size="sm" variant="danger" className="ml-2" onClick={() => deleteSource(item._id)}>
                                            <i className="fas fa-trash" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                <Pagination count={Math.ceil(total / pageSize)} page={page} onChange={changePage} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handleSave(selectedSource)} disabled={!selectedSource.id}>
                    Save
                </Button>
            </Modal.Footer>
            <Modal show={visible} onHide={() => setVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Source</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="name">
                            <Form.Label>name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setVisible(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateSource}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </Modal>
    );
}