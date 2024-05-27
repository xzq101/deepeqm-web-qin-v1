import React, { useState, useEffect } from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import axios from '../utils/axios';
import FormContainer from '../components/FormContainer';
import Message from '../components/Message';

const VerifyScreen = () => {
    const [error, setError] = useState ('');
    const [email, setEmail] = useState ('');
    const [code, setCode] = useState ('');
    const [seconds, setSeconds] = useState(60);
    const [isActive, setIsActive] = useState(false);

    const submitHandler = e => {
        e.preventDefault ();
        axios.post('/public/verifyEmail', {email: email, code: Number(code)})
            .then(res => {
                window.localStorage.removeItem('isVerify');
                const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
                userInfo.token = res.result;
                window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
                document.location.href = '/myclasses';
            })
            .catch(err => {
                setError(err.msg);
            })
    }

    const sendEmail = () => {
        setError('');
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
            <h1>Sign In</h1>
            {error && <Message variant="danger">{error}</Message>}
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

                <Button type="submit" variant="primary">
                Verify
                </Button>
            </Form>
        </FormContainer>
    );
}

export default VerifyScreen;