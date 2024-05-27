import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import axios from '../utils/axios'

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [role, setRole] = useState('');
  const [dependent, setDependent] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getUserDetail = () => {
    axios.get(`/admin/getUserById`, {
      params: {
        id: userId
      }
    }).then(res => {
      const user = res.result;
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
      setRole(user.role);
      setDependent(user.dependent);
    })
  }

  const submitHandler = e => {
    e.preventDefault();
    if (role === 'Parent' && dependent) {
      const dependents = dependent.split(';');
      // 邮箱格式验证
      if (!dependents.every(d => /\S+@\S+\.\S+/.test(d))) {
        console.log('Dependent email format error');
        setError('Dependent email format error');
        return;
      }
    }
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    axios.post(`/admin/updateUser`, {
      _id: userId,
      name,
      email,
      isAdmin,
      password,
      role,
      dependent: dependent.trim(),
    }).then(res => {
      history.push('/admin/userlist');
      setLoading(false);
    }).catch(err => {
      setError(err.msg);
      setLoading(false);
    });
  };

  useEffect(() => {
    getUserDetail();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {error && <Message variant="danger">{error}</Message>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="isadmin">
            <Form.Check
              type="checkbox"
              label="Is Admin"
              checked={isAdmin}
              onChange={e => setIsAdmin(e.target.checked)}
            />
          </Form.Group>

          <Form.Group controlId="Role">
            <Form.Label>{`Role is: ${role}`}</Form.Label>
            <Form.Control
              as="select"
              defaultValue={role}
              onChange={e => setRole(e.target.value)}
              custom
            >
              <option>{role}</option>
              <option value="Student">Student</option>
              <option value="Parent">Parent</option>
              <option value="Teacher">Teacher</option>

            </Form.Control>
          </Form.Group>

          <Form.Group controlId="dependent">
            <Form.Label>
              Dependent (Parent or Student) email:
            </Form.Label>
            <Form.Control
              type="name"
              placeholder="When multiple dependents, use semicolons to seperate"
              value={dependent}
              onChange={e => setDependent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            {
              loading ? <Spinner animation="border" size="sm" /> : 'Update'
            }
          </Button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default UserEditScreen;
