import React, { useState, useEffect, useCallback } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { Form, Table, Button, Row, Col, Container, Modal, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserByEmail } from '../actions/userActions';
import axios from '../utils/axios';
import { REGISTER_CREATE_RESET } from '../constants/registerConstants';
import { FIND_USER_EMAIL_RESET } from '../constants/userConstants';

import {
  ShowClassDetails,
  updateClassByTeach,
  listTeacherClasses,
  addHWToClass,
  deleteHWFromClass,
} from '../actions/classActions';

import { getHwDetailsAddClass } from '../actions/hwActions';

const TeachAddContentToClassView = ({ history, match }) => {
  const classId = match.params.id;

  const [keyword, setKeyword] = useState('');

  const dispatch = useDispatch();

  const classDetail = useSelector(state => state.classDetails);
  const { loading, error, tClass } = classDetail;

  const hwDetail = useSelector(state => state.hwDetailsAddClass);
  const { loading: LoadHW, error: errorHW, hw: hwInfo } = hwDetail;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  const isTeacher = userInfo.role === 'Teacher';
  const [visible, setVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [homeworkDetail, setHomeworkDetail] = useState({});
  const [success, setSuccess] = useState('');

  let classInfo = {};
  if (tClass) {
    classInfo.name = tClass.name;
    classInfo.teacher = tClass.user;
    classInfo.image = tClass.image;
    classInfo.price = tClass.price;
    classInfo.classID = tClass._id;
  }
  const classAddedHW = useSelector(state => state.classAddHW);
  const {
    loading: loadingAddHW,
    error: errorAddHW,
    success: successAddHW,
  } = classAddedHW;

  // console.log ('registerInfo', registerInfo);

  useEffect(
    () => {
      if (!userInfo || !isTeacher) {
        history.push('/login');
      } else {
        if (!tClass || tClass._id !== classId) {
          dispatch(ShowClassDetails(classId));
        } else {
        }
      }
    },
    [dispatch, history, tClass, classId, hwDetail, successAddHW, userInfo, isTeacher]
  );

  const searchHomeWorkHandler = e => {
    e.preventDefault();
    dispatch(getHwDetailsAddClass(keyword));
  };

  const addHomeWorkHandler = e => {
    e.preventDefault();
    if (hwInfo) {
      const hwAdd = {
        hwID: hwInfo._id,
        name: hwInfo.name,
        isPub: hwInfo.isPublish,
        creator: hwInfo.creator,
      };
      //  console.log ('dispatch addQToHW conl hwId=', hwId);
      dispatch(addHWToClass(classId, hwAdd));
      setKeyword('');
      dispatch(getHwDetailsAddClass(keyword));

      dispatch(ShowClassDetails(classId));
    }
  };

  const deleteHWfromClassHandler = hw => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteHWFromClass(tClass._id, hw))
    }
    dispatch(ShowClassDetails(classId));
  };

  const openStudentModal = hw => {
    setHomeworkDetail(hw);
    setVisible(true);
    getStudentList(hw.hwID);
  }

  const closeStudentModal = () => {
    setVisible(false);
    setStudents([]);
  };

  const setChecked = (checked, index) => {
    const list = [...students];
    list[index].select = checked;
    setStudents(list);
  };

  const setAllChecked = (checked) => {
    const list = [...students];
    list.forEach(item => {
      item.select = checked;
    });
    setStudents(list);
    setSelectAll(checked);
  };

  const publishHomework = useCallback(() => {
    const list = [...students];
    const selected = list.filter(item => (item.select && !item.isPublished));
    const studentIDs = selected.map(item => item.student.ID);
    if (studentIDs.length === 0) return;
    axios.post('/teacher/publishHomework', {
      classID: tClass ? tClass._id : '',
      hwID: homeworkDetail.hwID,
      studentIDs
    }).then(() => {
      students.forEach(item => {
        item.select = false;
      });
      setStudents(students);
      setSelectAll(false);
      setVisible(false);
      setSuccess('Publish homework successfully');
    })
  }, [students, tClass, homeworkDetail.hwID]);


  const getStudentList = useCallback((hwID) => {
    if (tClass) {
      axios.post('/teacher/getStudentListByExercise', {
        classID: tClass ? tClass._id : '',
        hwID,
      }).then(res => {
        const list = res.result.list;
        list.forEach(item => {
          list.select = false;
        });
        setStudents(list);
      })
    }
  }, [tClass]);

  const unPublishHomework = (index) => {
    if (window.confirm('Are you sure')) {
      const list = [...students];
      let exerciseIds;
      if (index === undefined) {
        exerciseIds = list.filter(item => item.select).map(item => item.exerciseId);
        axios.post('/teacher/unPublishHomework', {
          exerciseIds: exerciseIds,
        }).then(() => {
          students.forEach(item => {
            item.select = false;
          });
          setStudents(students);
          setSelectAll(false);
          setVisible(false);
          setSuccess('Unpublish homework successfully');
        });
      } else {
        const student = list[index];
        exerciseIds = [student.exerciseId];
        axios.post('/teacher/unPublishHomework', {
          exerciseIds: exerciseIds,
        }).then(() => {
          student.isPublished = false;
          student.exerciseId = '';
          setStudents(list);
        });
      }
    }
  }

  const deleteAllHomework = () => {
    if (window.confirm('Are you sure')) {
      axios.post('/teacher/deleteAllHomework', {
        id: tClass._id,
      }).then(() => {
        dispatch(ShowClassDetails(classId));
      });
    }
  }


  // useEffect(() => {
  //   getStudentList()
  // }, [getStudentList]);

  return (
    <Container>

      <Link to="/teach/classlist" className="btn btn-light my-3">
        Go Back
      </Link>
      {tClass
        ? <h3>{`Add Homework to: ${tClass.name}`}</h3>
        : <h3> Add Homework </h3>}

      {LoadHW
        ? <Loader />
        : errorHW
          ? <Message variant="danger">{errorHW}</Message>
          : <Container />}
      { success && <Message variant="success">{success}</Message>}
      <Row className="align-items-center">
        <Form onSubmit={searchHomeWorkHandler} inline>
          <Form.Group controlId="search">
            <Form.Control
              className="mr-sm-3 ml-sm-6"
              type="text"
              name="q"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="HW ID ..."
            />
            <Button type="submit" variant="outline-success">
              Search
            </Button>
          </Form.Group>
        </Form>
      </Row>
      <Row className="align-items-center" style={{ marginBottom: '10px' }}>
        <Col>
        <Form onSubmit={addHomeWorkHandler} inline>

          <Form.Group as={Row} controlId="found hw">
            <Form.Label column sm={2}>
              Found
            </Form.Label>
            <Col sm={6}>
              <Form.Control type="text" value={hwInfo ? hwInfo.name : ''} />
            </Col>
            <Col sm={4}>
              <Button type="submit" variant="outline-success">
                Add
              </Button>
            </Col>
          </Form.Group>
        </Form>
        </Col>
        <Col>
        <Button variant="danger" style={{ float: 'right'}} onClick={deleteAllHomework}>REMOVE ALL HOMEWORK</Button>
        </Col>
      </Row>
      {tClass
        ? <Row>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>NAME</th>
                <th>HomeWork</th>
                <th>Due Date</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tClass.homeworkList.map((hw, index) => (
                <tr key={hw._id}>
                  <td>{hw.name}</td>
                  <td>{hw.hwID._id}</td>
                  <td>{hw.hwID.dueDate ? hw.hwID.dueDate.split ('T')[0] : ''}</td>
                  <td>
                    <Button
                      className="btn-sm mr-2"
                      onClick={() => openStudentModal(hw)}
                    >
                      <i className="fas fa-arrow-up" />
                    </Button>
                    <LinkContainer
                      to={`/teacher/correctionExercise/${classId}/${hw.hwID._id}`}
                    >
                      <Button variant="light" className="btn-sm mr-2">
                        <i className="fas fa-pen" />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHWfromClassHandler(hw)}
                    >
                      <i className="fas fa-trash" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
        : <h6>No HomeWork added.</h6>}
      <Modal show={visible} onHide={closeStudentModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>HOMEWORK</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th><input type="checkbox" checked={selectAll} onChange={(e) => setAllChecked(e.currentTarget.checked)} /></th>
                <th>Student</th>
                <th>email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, index) => (
                <tr key={s.student.ID}>
                  <td>
                    <input type="checkbox" checked={s.select} onChange={(e) => setChecked(e.currentTarget.checked, index)} />
                  </td>
                  <td>{s.student.name}</td>
                  <td>{s.student.email}</td>
                  <td>
                    {s.isPublished && <Badge variant="danger" style={{ cursor: 'pointer' }} onClick={() => unPublishHomework(index)}>unpublish</Badge> }
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => unPublishHomework()}>
            Unpublish
          </Button>
          <Button variant="primary" onClick={publishHomework}>
            Publish
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TeachAddContentToClassView;
