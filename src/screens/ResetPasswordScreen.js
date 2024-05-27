import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Form, Button, Row, Col} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import {login} from '../actions/userActions';
import axios from '../utils/axios';

const LoginScreen = ({location, history}) => {
  const [email, setEmail] = useState ('');
  const [code, setCode] = useState ('');
  const [password, setPassword] = useState ('');
  const [confirmPassword, setConfirmPassword] = useState ('');
  const [error, setError] = useState ('');
  const [loading, setLoading] = useState (false);
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);

  const submitHandler = e => {
    e.preventDefault ();
    if (!email) {
      setError ('Please enter email');
      return;
    }
    if (!code) {
      setError ('Please enter code');
      return;
    }
    if (password !== confirmPassword) {
      setError ('Passwords do not match');
      return;
    }
    axios.post('/login/resetPassword', { email, code: Number(code), password })
      .then(() => {
        history.push('/login');
      }).catch(err => {
        setError(err.msg);
      });
  };

  const sendEmail = () => {
    setIsActive(true);
    setSeconds(60);
    axios.post('/login/sendEmail', {email: email})
      .catch(err => {
        setError(err.msg)
      })
  }

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <FormContainer>
      <h1>Reset Password</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={e => setEmail (e.target.value)}
            style={{ width: 'calc(100% - 82px)', display: 'inline-block'}}
          />
          <Button variant="primary" onClick={sendEmail} disabled={isActive} style={{ height: '45px', width: '82px' }}>
            {isActive ? `${seconds}s` : 'Send'}
          </Button>
        </Form.Group>
        <Form.Group controlId="code">
          <Form.Label>Code</Form.Label>
          <Form.Control
            placeholder="Enter code"
            value={code}
            onChange={e => setCode (e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={e => setPassword (e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={e => setConfirmPassword (e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Reset
        </Button>
      </Form>
    </FormContainer>
  );
};

export default LoginScreen;
