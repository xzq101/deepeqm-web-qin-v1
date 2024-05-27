import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Row, Col, Container, Badge } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import ReactPaginate from 'react-paginate';
import axios from '../utils/axios';

const STATUS = {
    0: 'Pending',
    1: 'Sent',
    2: 'Failed',
    3: 'Partially successful',
}

const EmailRecordScreen = ({ history, match }) => {
    const [emails, setEmails] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [allChecked, setAllChecked] = useState(false);
    
    const getEmails = useCallback(() => { 
        axios.get('/admin/getEmails', {
            params: {
                page,
                pageSize
            }
        })
        .then(res => {
            const { list, total } = res.result;
            list.forEach(item => {
                item.selected = false;
            });
            setAllChecked(false);
            setEmails(list);
            setTotal(total);
        })
    }, [page, pageSize])

    const send = () => {
        history.push('/admin/sendEmail')
    }

    const deleteEmail = (id) => {
        if (window.confirm('Are you sure')) {
            axios.post(`/admin/deleteEmail`, {
                ids: [id]
            }).then(res => {
                getEmails()
            })
        }
    }

    const handlePageClick = (data) => {
        const { selected } = data;
        setPage(selected + 1);
    }

    const selectEmail = (index) => {
        const newEmails = [...emails];
        newEmails[index].selected = !newEmails[index].selected;
        setEmails(newEmails);
    }

    const selectAll = () => {
        const newEmails = [...emails];
        newEmails.forEach(item => {
            item.selected = !allChecked;
        });
        setEmails(newEmails);
        setAllChecked(!allChecked);
    }

    const batchDelete = () => {
        const ids = emails.filter(item => item.selected).map(item => item._id);
        if (ids.length === 0) {
            return;
        }
        if (window.confirm('Are you sure')) {
            axios.post(`/admin/deleteEmail`, {
                ids,
            }).then(res => {
                getEmails()
            })
        }
    }

    useEffect(() => {
        getEmails()
    }, [getEmails]);

    return (
        <Container>
            <Row className="align-items-center">
                <Col>
                    <h1>Email </h1>
                </Col>
                <Col className="text-right">
                    <Button className="mr-3" onClick={send}>
                        Send Email
                    </Button>
                    <Button variant='danger' className="my-3" onClick={batchDelete}>
                        Delete Email
                    </Button>
                </Col>
            </Row>
            <Container>
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th><input checked={allChecked} type='checkbox' onClick={selectAll} /></th>
                            <th>Title</th>
                            <th>recipient</th>
                            <th>Group</th>
                            <th>Create</th>
                            <th>Status</th>
                            <td />
                        </tr>
                    </thead>
                    <tbody>
                        {emails.map((cl, index) => (
                            <tr key={cl._id}>
                                <td><input type='checkbox' checked={cl.selected} onClick={() => selectEmail(index)} /></td>
                                <td>{cl.title}</td>
                                <td>{cl.recipient.join(', ')}</td>
                                <td>{cl.emailGroup.map(item => item.name).join(', ')}</td>
                                <td>{new Date(cl.createdAt).toLocaleString()}</td>
                                <td>{STATUS[cl.status]}</td>
                                <td>
                                    <Button variant="light" className="btn-sm" onClick={() => deleteEmail(cl._id)}>
                                        <i className="fas fa-trash" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <ReactPaginate
                    className='react-paginate'
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={Math.ceil(total / pageSize)}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                />
            </Container>
        </Container>
    );
};

export default EmailRecordScreen;
