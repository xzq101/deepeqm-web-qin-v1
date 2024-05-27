import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Form, Button, Row, Col} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
// import {login} from '../actions/userActions';
import axios from '../utils/axios';

const LoginScreen = ({location, history}) => {
  //console.log ('location', location);
  const [email, setEmail] = useState ('');
  const [password, setPassword] = useState ('');
  const [error, setError] = useState ('');

  // const dispatch = useDispatch ();

  const userLogin = useSelector (state => state.userLogin);
  const {userInfo} = userLogin;

  const redirect = location.search
    ? location.search.split ('=')[1]
    : '/myclasses';

  //console.log ('redirect', redirect);

  useEffect (
    () => {
      if (userInfo) {
        history.push (redirect);
      }
    },
    [history, userInfo, redirect]
  );

  const submitHandler = e => {
    e.preventDefault ();
    // dispatch (login (email, password));
    setError ('');
    axios.post('/login/authUser', {email, password}).then(res => {
      localStorage.setItem ('userInfo', JSON.stringify (res.result));
      document.location.href = '/profile';
    }).catch(err => {
      setError(err.msg);
    });
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant="danger">{error}</Message>}
      {/* {loading && <Loader />} */}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={e => setEmail (e.target.value)}
          />
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

        <Button type="submit" variant="primary">
          Sign In
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>&nbsp;/&nbsp;
          <Link to="/resetPassword">Forget Password</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
