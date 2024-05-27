import React, {useEffect, useState} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Table, Button, Row, Col, Container, Form} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
//import Paginate from '../components/Paginate'
import {
  createClassByT,
  listTeacherClasses,
  deleteClassByTeach,
} from '../actions/classActions';
import {
  CLASS_CREATE_RESET,
  CLASS_LIST_FOR_TEACHER_RESET,
} from '../constants/classConstants';
import axios from '../utils/axios';

const publishStatusColor = {
  0: 'gray',
  1: '#FFE7A0',
  2: 'red',
}

const TeachClassListView = ({history, match}) => {
  const dispatch = useDispatch ();

  const userLogin = useSelector (state => state.userLogin);
  const {userInfo} = userLogin;
  const isTeacher = userInfo.role === 'Teacher';
  //console.log ('isTeacher', isTeacher);

  const classList = useSelector (state => state.classListForT);
  const {loading, error, classes} = classList;

  const classCreate = useSelector (state => state.classCreateByT);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    tclass: createClass,
  } = classCreate;

  const classDelete = useSelector (state => state.classDeleteByT);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = classDelete;
  const [name, setName] = useState ('');

  useEffect (
    () => {
      dispatch ({type: CLASS_CREATE_RESET});

      if (!userInfo || !isTeacher) {
        history.push ('/login');
      }

      if (successCreate) {
        history.push (`/teach/class/${createClass._id}/edit`);
      } else {
        dispatch (listTeacherClasses ());
      }
    },
    [dispatch, history, userInfo, successCreate, successDelete, createClass, isTeacher]
  );

  const createClassHandler = () => {
    dispatch (createClassByT ());
  };
  const deleteClassHandler = id => {
    if (window.confirm ('Are you sure')) {
      dispatch (deleteClassByTeach (id));
    }
  };
  const searchClass = () => {
    dispatch (listTeacherClasses (name));
  }

  const setPublish = (id, isPublish) => {
    axios.post('/teacher/setPublishClass', {
      id,
      publish: isPublish === 0 ? 1 : 0
    }).then(res => {
      dispatch (listTeacherClasses ());
    })

  }

  const copy = (id) => {
    axios.post('/teacher/copyClass', {
      id
    }).then(res => {
      dispatch (listTeacherClasses ());
    })
  }

  return (
    <Container>
      <Row className="align-items-center">
        <Col>
          <h1>My Classes </h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createClassHandler}>
            <i className="fas fa-plus" /> Create New Class
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading
        ? <Loader />
        : error
            ? <Message variant="danger">{error}</Message>
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
                    <Button onClick={searchClass} variant="outline-success">
                      Search
                    </Button>
                  </Form.Group>
                </Form>
                {
                  classes.length > 0 ?
                  (
                    <Table striped bordered hover responsive className="table-sm">
                  <thead>
                    <tr>

                      <th>NAME</th>
                      <th>PRICE</th>
                      <th>CATEGORY</th>
                      <th>Start </th>
                      <th>End </th>
                      <th>Add</th>

                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map (cl => (
                      <tr key={cl._id}>
                        <td>{cl.name}</td>
                        <td>${cl.price}</td>
                        <td>{cl.category}</td>
                        <td>{cl.startDate.split ('T')[0]}</td>
                        <td>{cl.endDate.split ('T')[0]}</td>
                        <td>
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
                        </td>
                        <td>
                          <LinkContainer to={`/teach/class/${cl._id}/edit`}>
                            <Button variant="light" className="btn-sm">
                              <i className="fas fa-edit" />
                            </Button>
                          </LinkContainer>
                          <Button variant="light" className="btn-sm" onClick={() => setPublish(cl._id, cl.isPublish)}>
                            <i className="fas fa-fire" style={{ color: publishStatusColor[cl.isPublish]}} />
                          </Button>
                          <Button variant="light" className="btn-sm" onClick={() => copy(cl._id)}>
                            <i className="fas fa-copy" />
                          </Button>
                          <Button
                            variant="danger"
                            className="btn-sm"
                            onClick={() => deleteClassHandler (cl._id)}
                          >
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
    </Container>
  );
};

export default TeachClassListView;
