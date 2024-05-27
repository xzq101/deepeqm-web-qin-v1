import React, {useState, useEffect} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Link} from 'react-router-dom';
import {Form, Table, Button, Row, Col, Container} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import { useSnackbar } from 'notistack';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {getUserByEmail} from '../actions/userActions';

import {REGISTER_CREATE_RESET} from '../constants/registerConstants';
import {FIND_USER_EMAIL_RESET} from '../constants/userConstants';
import axios from '../utils/axios';

import {
  ShowClassDetails,
  updateClassByTeach,
  listTeacherClasses,
} from '../actions/classActions';

import {
  createRegisterByTeacher,
  listStudentsInClass,
  removeStudentFromClass,
} from '../actions/registerAction';

const TeachClassStudentsView = ({history, match}) => {
  const classId = match.params.id;

  const [keyword, setKeyword] = useState ('');
  const [email, setEmail] = useState ('');
  const [interestList, setInterestList] = useState([]);

  const dispatch = useDispatch ();

  const classDetail = useSelector (state => state.classDetails);
  const {loading, error, tClass} = classDetail;

  const userLogin = useSelector (state => state.userLogin);
  const {userInfo} = userLogin;
  const isTeacher = userInfo.role === 'Teacher';

  const studentFound = useSelector (state => state.findUserByEmail);

  const studentRegistered = useSelector (state => state.registerCreate);
  const studentList = useSelector (state => state.studentListInClass);
  const removeStudent = useSelector (state => state.removeStudentFromClass);
  const {success: successDelete} = removeStudent;

  const { enqueueSnackbar } = useSnackbar();

  const {
    loading: loadingStudentList,
    error: errorStudentList,
    success: successStudentList,
    students: studentsInClass,
  } = studentList;

  const {
    success: successRegistered,
    loading: loadingRegistered,
    error: errorRegistered,
    register: studentRegisteredInfo,
  } = studentRegistered;

  const {
    loading: loadingSearch,
    error: errorSearch,
    studentInfo,
  } = studentFound;

  let student = {};
  if (studentInfo) {
    student.name = studentInfo.name;
    student.email = studentInfo.email;
    student.ID = studentInfo._id;
  }

  let classInfo = {};
  if (tClass) {
    classInfo.name = tClass.name;
    classInfo.teacher = tClass.user;
    classInfo.image = tClass.image;
    classInfo.price = tClass.price;
    classInfo.classID = tClass._id;
  }

  let registerInfo = {};

  if (studentInfo && classInfo) {
    registerInfo.student = student;
    registerInfo.classInfo = classInfo;
  }

  // console.log ('registerInfo', registerInfo);

  useEffect (
    () => {
      if (!userInfo || !isTeacher) {
        history.push ('/login');
      } else {
        if (!tClass || tClass._id !== classId) {
          dispatch (ShowClassDetails (classId));
        } else {
          dispatch (listStudentsInClass (tClass._id));
        }
      }
    },
    [dispatch, history, studentFound, tClass, successRegistered, successDelete, userInfo, isTeacher, classId]
  );

  const searchHandler = e => {
    e.preventDefault ();
    dispatch (getUserByEmail (keyword));
  };

  const addHandler = e => {
    e.preventDefault ();

    dispatch (createRegisterByTeacher (registerInfo));
    dispatch ({type: REGISTER_CREATE_RESET});
    dispatch ({type: FIND_USER_EMAIL_RESET});
    setKeyword ('');
    // history.push (`/teach/class/${tClass._id}/addStudent`);
    // console.log ('add', registerInfo);
  };

  const removeStudentHandler = (stuID, clID) => {
    if (window.confirm ('Are you sure')) {
      dispatch (removeStudentFromClass (stuID, clID));
    }
  };

  const getInterstList = () => {
    axios.get(`/teacher/getClassRegisterList?id=${match.params.id}`).then(res => {
        setInterestList(res.result.list);
    })
  };

  const getStatus = (interest) => {
      if (interest.registered) {
          return 'Registered';
      } else if (interest.paid) {
          return 'Pending payment confirmation';
      } else {
          return 'Interested';
      }
  }

  const add = (id) => {
      if (window.confirm('Are you sure to add this student to class?')) {
          axios.post('/teacher/registerClass', {
              interestId: id,
          }).then(() => {
              getInterstList();
              dispatch(ShowClassDetails(classId));
              enqueueSnackbar('Add success', { variant: 'success' });
          });
      }
  }

  const deleteInterest = (id) => {
      if (window.confirm('Are you sure to delete this interest?')) {
          axios.post('/teacher/deleteRegisterClass', {
              interestId: id,
          }).then(() => {
              getInterstList();
              enqueueSnackbar('Delete success', { variant: 'success' });
          });
      }
  }

  const getDurationType = (type) => {
    switch (type) {
      case 1:
        return '1 month';
      case 2:
        return '1 year';
      default:
        return '';
    }
  }

  const getExpiredTime = (interest) => {
    if (interest.registered) {
      return new Date(interest.expirationDate).toLocaleString();
    } else {
      return '';
    }
  }

  useEffect(() => {
    getInterstList()
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>

      <Link to="/teach/classlist" className="btn btn-light my-3">
        Go Back
      </Link>
      {tClass
        ? <h2>{`Add Students to: ${tClass.name}`}</h2>
        : <h2> Add Students </h2>}
      <Row className="justify-content-md-center">
        <Col md={8}>

          {loadingSearch
            ? <Loader />
            : errorSearch
                ? <Message variant="danger">{errorSearch}</Message>
                : <Container />}

          <Form onSubmit={searchHandler} inline>
            <Form.Group controlId="search">
              <Form.Control
                className="mr-sm-3 ml-sm-6"
                type="text"
                name="q"
                value={keyword}
                onChange={e => setKeyword (e.target.value)}
                placeholder="Student Email ..."
              />
              <Button type="submit" variant="outline-success">
                Search
              </Button>
            </Form.Group>
          </Form>

          <Form onSubmit={addHandler} inline>
            {loadingRegistered && <Loader />}
            {errorRegistered &&
              <Message variant="danger">{errorRegistered}</Message>}
            <Form.Group as={Row} controlId="found student">
              <Form.Label column sm={2}>
                Found
              </Form.Label>
              <Col sm={6}>
                <Form.Control
                  type="text"
                  value={studentInfo ? studentInfo.name : ''}
                />
              </Col>
              <Col sm={4}>
                <Button type="submit" variant="outline-success">
                  Add
                </Button>
              </Col>
            </Form.Group>

          </Form>
        </Col>
      </Row>
      <Row>
        <h2> Number of Student in Class</h2>
      </Row>
      <Row>

        <h4 className='mt-4'>Student list</h4>
        {loadingStudentList
          ? <Loader />
          : errorStudentList
              ? <Message variant="danger">{errorStudentList}</Message>
              : <Table striped bordered hover responsive className="table-sm">
                  <thead>
                    <tr>

                      <th>Student</th>
                      <th>email</th>
                      <th>parent name & phone</th>
                      <th>parent email</th>
                      <th></th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {studentsInClass.map (s => (
                      <tr key={s.student.ID}>
                        <td>{s.student.name}</td>
                        <td>{s.student.email}</td>
                        <td>
                          {
                            s.parent && (
                              <div>
                                <div>name: {s.parent.name}</div>
                                {/* <div>email: {s.parent.email}</div> */}
                                <div>phone: {s.parent.phone}</div>
                              </div>
                            )
                          }
                        </td>
                        <td>{s.parent && s.parent.email}</td>
                        <td>
                          <LinkContainer
                            to={`/teacher/exercise/${s.classInfo.classID}/${s.student.ID}`}
                          >
                            <Button variant="light" className="btn-sm">
                              Exercise
                            </Button>
                          </LinkContainer>
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            className="btn-sm"
                            onClick={() =>
                              removeStudentHandler (
                                s.student.ID,
                                s.classInfo.classID
                              )}
                          >
                            <i className="fas fa-trash" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>}
      </Row>
      <Row>
          <h4 className='mt-4'>Interest List</h4>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Expired Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {interestList.map((interest, index) => (
                <tr key={interest._id}>
                  <td>{interest.student && interest.student.name}</td>
                  <td>{interest.student && interest.student.email}</td>
                  <td>{getDurationType(interest.durationType)}</td>
                  <td>
                    {getStatus(interest)}
                  </td>
                  <td>
                    {/* {new Date(interest.updatedAt).toLocaleString()} */}
                    {getExpiredTime(interest)}
                  </td>
                  <td>
                    {!interest.registered && <Button className="btn-sm" onClick={() => add(interest._id)}>Add</Button>}
                    <Button
                      variant="danger"
                      className="btn-sm ml-2"
                      onClick={() => deleteInterest(interest._id)}>
                      <i className="fas fa-trash" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
    </Container>
  );
};

export default TeachClassStudentsView;
