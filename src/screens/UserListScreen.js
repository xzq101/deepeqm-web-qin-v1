import React, {useEffect, useState} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Table, Button, Container, Form, Row, Col, Modal} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {listUsers, deleteUser} from '../actions/userActions';
import axios from '../utils/axios';

const UserListScreen = ({history}) => {
  const dispatch = useDispatch ();

  const userList = useSelector (state => state.userList);
  const {loading, error, users} = userList;

  const userLogin = useSelector (state => state.userLogin);
  const {userInfo} = userLogin;

  const userDelete = useSelector (state => state.userDelete);
  const {success: successDelete} = userDelete;
  const [keyword, setKeyword] = useState ('');

  const [showCreate, setShowCreate] = useState (false);
  const [name, setName] = useState ('');
  const [email, setEmail] = useState ('');
  const [password, setPassword] = useState ('');
  const [confirmPassword, setConfirmPassword] = useState ('');
  const [role, setRole] = useState ('Student');
  const [createError, setCreateError] = useState ('');

  useEffect (
    () => {
      if (userInfo && userInfo.isAdmin) {
        dispatch (listUsers ());
      } else {
        history.push ('/login');
      }
    },
    [dispatch, history, successDelete, userInfo]
  );

  const deleteHandler = id => {
    if (window.confirm ('Are you sure')) {
      dispatch (deleteUser (id));
    }
  };

  const searchUser = () => {
    dispatch(listUsers (keyword));
  }

  const openCreateModal = () => {
    setShowCreate (true);
  };

  const resetCreateModal = () => {
    setName ('');
    setEmail ('');
    setPassword ('');
    setConfirmPassword ('');
    setRole ('Student');
    setCreateError ('');
  };

  const closeCreateModal = () => {
    setShowCreate (false);
    resetCreateModal ();
  };

  const createUser = () => {
    if (!email) {
      setCreateError ('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setCreateError ('Email address is invalid');
      return;
    }
    if (password !== confirmPassword) {
      setCreateError ('Passwords do not match');
      return;
    }
    const params = {
      name,
      email,
      password,
      role,
    };
    axios.post('/admin/createUser', params)
      .then(res => {
        dispatch (listUsers ());
        closeCreateModal ();
      }).catch(err => {
        setCreateError (err.msg);
      });
  };

  return (
    <Container>
      <Row className="align-items-center">
        <Col>
          <h1>Users</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={openCreateModal}>
            <i className="fas fa-plus" /> Create User
          </Button>
        </Col>
      </Row>
      {loading
        ? <Loader />
        : error
            ? <Message variant="danger">{error}</Message>
            : (<div>
              <Form inline style={{ marginBottom: '10px' }}>
                <Form.Group controlId="search">
                  <Form.Control
                    className="mr-sm-3 ml-sm-6"
                    type="text"
                    name="name"
                    value={keyword}
                    onChange={e => setKeyword (e.target.value)}
                    placeholder="Search By NAME/EMAIL"
                  />
                  <Button onClick={searchUser} variant="outline-success">
                    Search
                  </Button>
                </Form.Group>
              </Form>
              <Button onClick={searchUser}>
                Search
              </Button>
              <Table striped bordered hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>Role</th>
                    <th width="300">Dependent</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {users.map (user => (
                    <tr key={user._id}>

                      <td>{user.name}</td>
                      <td>
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      </td>
                      <td>{user.role}</td>

                      <td>
                        {user.dependent}
                      </td>
                      <td>
                        <LinkContainer to={`/admin/user/${user._id}/edit`}>
                          <Button variant="light" className="btn-sm">
                            <i className="fas fa-edit">Edit</i>
                          </Button>
                        </LinkContainer>
                        <Button
                          variant="danger"
                          className="btn-sm"
                          onClick={() => deleteHandler (user._id)}
                        >
                          <i className="fas fa-trash">Delete</i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>)}
      
      <Modal show={showCreate} onHide={closeCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {createError && <Message variant="danger">{createError}</Message>}
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={e => setName (e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={e => setEmail (e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="Role">
              <Form.Label>{`Role is: ${role}`}</Form.Label>
              <Form.Control
                as="select"
                defaultValue={role}
                onChange={e => setRole (e.target.value)}
                custom
              >
                <option>{role}</option>
                <option value="Student">Student</option>
                <option value="Parent">Parent</option>
                <option value="Teacher">Teacher</option>

              </Form.Control>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword (e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword (e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCreateModal}>
            Close
          </Button>
          <Button variant="primary" onClick={createUser}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserListScreen;
