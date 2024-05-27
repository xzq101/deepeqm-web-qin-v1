import React, {useEffect, useState} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Table, Button, Row, Col, Container, Form, Modal} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import axios from '../utils/axios';
//import Paginate from '../components/Paginate'

import {createHW, listTeacherHWs, deleteHW} from '../actions/hwActions';

import {HW_CREATE_RESET} from '../constants/hwConstants';

const TeachHWListView = ({history, match}) => {
  const dispatch = useDispatch ();

  const userLogin = useSelector (state => state.userLogin);
  const {userInfo} = userLogin;
  const isTeacher = userInfo.role === 'Teacher';
  //console.log ('isTeacher', isTeacher);

  const hwCreated = useSelector (state => state.hwCreate);
  const {
    loading: loadingCreateQ,
    error: errorCreateQ,
    success: successCreateQ,
    hw: hwCreateInfo,
  } = hwCreated;

  const hwList = useSelector (state => state.hwListForTeacher);
  const {loading: loadingList, error: errorList, hws} = hwList;

  const hwDeleted = useSelector (state => state.hwDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = hwDeleted;
  const [name, setName] = useState ('');
  // const [studentList, setStudentList] = useState ([]);
  // const [exerciseVisible, setExerciseVisible] = useState (false);

  useEffect (
    () => {
      dispatch ({type: HW_CREATE_RESET});

      if (!userInfo || !isTeacher) {
        history.push ('/login');
      } else {
        dispatch (listTeacherHWs ());
      }
    },
    [dispatch, history, userInfo, successCreateQ, successDelete, isTeacher]
  );

  const createHWHandler = () => {
    dispatch (createHW ());
  };

  const deleteQuestionHandler = id => {
    if (window.confirm ('Are you sure')) {
      dispatch (deleteHW (id));
    }
  };

  const searchHomeWork = () => {
    dispatch (listTeacherHWs (name));
  }

  const copy = (id) => {
    axios.post('/teacher/copyHomeWork', {
      id
    }).then(res => {
      dispatch (listTeacherHWs ());
    })
  }

  // const openExerciseModal = id => {
  //   axios.get(`/teacher/getStudentExerciseByHomework?id=${id}`).then(res => {
  //     setStudentList(res.result.list);
  //     setExerciseVisible(true);
  //   })
  // }

  // const closeExerciseModal = () => {
  //   setExerciseVisible(false);
  // }

  return (
    <Container>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreateQ && <Loader />}
      {errorCreateQ && <Message variant="danger">{errorCreateQ}</Message>}
      <Row className="align-items-center">
        <Col>
          <h1>My HomeWorks </h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createHWHandler}>
            <i className="fas fa-plus" /> Create New Homeworks
          </Button>
        </Col>
      </Row>
      {loadingList
        ? <Loader />
        : errorList
            ? <Message variant="danger">{errorList}</Message>
            : <Container>
                <Form inline style={{ marginBottom: '10px' }}>
                  <Form.Group controlId="search">
                    <Form.Control
                      className="mr-sm-3 ml-sm-6"
                      type="text"
                      name="name"
                      value={name}
                      onChange={e => setName (e.target.value)}
                      placeholder="Search By NAME"
                    />
                    <Button onClick={searchHomeWork} variant="outline-success">
                      Search
                    </Button>
                  </Form.Group>
                </Form>
                {
                  hws.length > 0 ? (
                    <Table striped bordered hover responsive className="table-sm">
                      <thead>
                        <tr>

                          <th>Name</th>
                          <th>id</th>
                          <th>description</th>
                          <th>classes</th>
                          {/* <th>Exercise</th> */}
                          <th />

                        </tr>
                      </thead>
                      <tbody>
                        {hws.map (hw => (
                          <tr key={hw._id}>
                            <td>{hw.name}</td>
                            <td>{hw._id}</td>
                            <td>{hw.description}</td>
                            <td>
                              {
                                hw.classes.map(c => (
                                  <p><a href={`/teach/class/${c._id}/addContent`}>{c.name}</a></p>
                                ))
                              }
                            </td>
                            {/* <td>
                              <Button onClick={() => openExerciseModal(hw._id)}>Detail</Button>
                            </td> */}
                            <td>
                              <LinkContainer to={`/teach/hw/${hw._id}/edit`}>
                                <Button variant="light" className="btn-sm">
                                  <i className="fas fa-edit" />
                                </Button>
                              </LinkContainer>
                              <Button variant="light" className="btn-sm" onClick={() => copy(hw._id)}>
                                <i className="fas fa-copy" />
                              </Button>
                              <Button
                                variant="danger"
                                className="btn-sm"
                                onClick={() => deleteQuestionHandler (hw._id)}
                              >
                                <i className="fas fa-trash" />
                              </Button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Message variant="info">No Homeworks found, change language or search again </Message>
                  )
                }
                
              </Container>}
        {/* <Modal show={exerciseVisible} onHide={closeExerciseModal}>
          <Modal.Header closeButton>
              <Modal.Title>Exercise</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Table striped bordered hover responsive className="table-sm">
                  <thead>
                      <tr>
                          <th>Name</th>
                          <th>Accuracy Tracker</th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                          studentList.map((student) => (
                              <tr key={student.student._id}>
                                  <td>{student.student.name}</td>
                                  <td>{student.correct}/{student.total}</td>
                              </tr>
                          ))
                      }
                  </tbody>
              </Table>
          </Modal.Body>
        </Modal> */}
    </Container>
  );
};

export default TeachHWListView;
