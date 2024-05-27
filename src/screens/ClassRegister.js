import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from "react-redux";
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Tooltip from '@mui/material/Tooltip';
import { useSnackbar } from 'notistack';
import axios from '../utils/axios';
import Loader from "../components/Loader";

const ClassRegister = ({ match }) => {

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const [parentInfo, setParentInfo] = useState({});
    const [studentInfo, setStudentInfo] = useState({});
    const [classInfo, setClassInfo] = useState({});
    const [students, setStudents] = useState([]);
    const [showType, setShowType] = useState(false);
    const [type, setType] = useState(1);
    const studentId = useRef('');
    const types = [{ value: 1, label: '1 month' }, { value: 2, label: '1 year' }];
    const [interested, setInterested] = useState(false);
    const [paid, setPaid] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [loading, setLoading] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const getRegisterDetail = () => {
        setLoading(true);
        axios.get(`/user/getClassRegister?id=${match.params.id}`).then((res) => {
            const { parentInfo, students, classInfo, interested, paid, registered, studentInfo } = res.result;
            setParentInfo(parentInfo || {});
            setStudents(students || []);
            setClassInfo(classInfo || {});
            setInterested(interested);
            setPaid(paid);
            setRegistered(registered);
            setStudentInfo(studentInfo || {});
        }).finally(() => {
            setLoading(false);
        });
    }

    const interest = () => {
        axios.post('/user/registerClass', { classId: match.params.id, userId: studentId.current, durationType: type }).then((res) => {
            getRegisterDetail();
            closeTypeModal();
            enqueueSnackbar('Interest success', { variant: 'success' });
        });
    }

    const openTypeModal = (id) => {
        studentId.current = id;
        if (classInfo.includeLibrary) {
            setShowType(true);
        } else {
            interest();
        }
    }

    const closeTypeModal = () => {
        setShowType(false);
        setType(1);
    }

    const pay = (id) => {
        if (window.confirm('Please confirm you have paid through the payment information below')) {
            axios.post('/user/payClass', { classId: match.params.id, userId: id }).then((res) => {
                getRegisterDetail();
                enqueueSnackbar('We have sent a mail to this teacher, please wait', { variant: 'success' });
            });
        }
    }

    const getStatus = (student) => {
        if (student.registered) {
            return 'Registered';
        } else if (student.interested) {
            if (student.paid) {
                return 'Pending payment confirmation';
            } else {
                return 'Interested';
            }
        } else {
            return '';
        }
    }

    useEffect(() => {
        getRegisterDetail();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <h1>Class Register</h1>
            {
                loading ? <Loader /> : (
                    <div>
                        <h4 className='mt-4'>Parent Information</h4>
                        <p>name: {parentInfo.name}</p>
                        <p>email: {parentInfo.email}</p>
                        <p>phone: {parentInfo.phone}</p>
                        {
                            userInfo.role === 'Student' && (
                                <>
                                    <h4 className='mt-4'>Student Information</h4>
                                    <p>name: {studentInfo.name}</p>
                                    <p>email: {studentInfo.email}</p>
                                </>
                            )
                        }
                        {
                            userInfo.role === 'Parent' ? 
                            (
                                <div>
                                    
                                    <h4 className='mt-4'>student list</h4>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>name</th>
                                                <th>Email</th>
                                                <th>Status</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                students.map((student, index) => (
                                                    <tr key={index}>
                                                        <td>{student.name}</td>
                                                        <td>{student.email}</td>
                                                        <td>
                                                            {getStatus(student)}
                                                        </td>
                                                        <td>
                                                            {
                                                                !student.interested && (
                                                                    <Tooltip title="If you interest in the class, please click 'Interest' to add to mail list.">         
                                                                        <Button onClick={() => openTypeModal(student._id)}>Register</Button>
                                                                    </Tooltip>
                                                                )
                                                            }
                                                            {
                                                                student.interested && !student.paid && <Button className="ml-2" onClick={() => pay(student._id)}>MAKE PAYMENT</Button>
                                                            }
                                                            {
                                                                student.registered && <Button className="ml-2" disabled>Enrolled</Button>
                                                            }
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            ) : (
                                <div>
                                    <p>status: {getStatus({ interested, paid, registered })}</p>
                                    {
                                        !interested && (
                                            <Tooltip title="If you interest in the class, please click 'Interest' to add to mail list.">         
                                                <Button onClick={() => openTypeModal(userInfo._id)}>Register</Button>
                                            </Tooltip>
                                        )
                                    }
                                    {
                                        interested && !paid && <Button className="ml-2" onClick={() => pay(userInfo._id)}>MAKE PAYMENT</Button>
                                    }
                                    {
                                        registered && <Button className="ml-2" disabled>Enrolled</Button>
                                    }
                                </div>
                            )
                        }
                        <div>
                            <h4 className='mt-4'>Payment Information</h4>
                            <div dangerouslySetInnerHTML={{ __html: classInfo.paymentInfo }}></div>
                            <p>After you paid, please click Paid button to inform the teacher.</p>
                        </div>
                    </div>
                )
            }
            <Modal show={showType} onHide={closeTypeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Duration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div>
                    {
                        types.map(r => (
                            <Form.Check
                                type="radio"
                                id={`role-${r.value}`}
                                label={r.label}
                                checked={r.value === type}
                                onChange={() => setType(r.value)}
                            />
                        ))
                    }
                </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeTypeModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={interest}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ClassRegister;