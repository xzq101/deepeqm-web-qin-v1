import React, {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import {Form, Button, Row, Col} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import {register} from '../actions/userActions';
import axios from '../utils/axios';
import { USER_REGISTER_FAIL } from '../constants/userConstants';

const RegisterScreen = ({location, history}) => {
  const [name, setName] = useState ('');
  const [email, setEmail] = useState ('');
  const [code, setCode] = useState ('');
  const [password, setPassword] = useState ('');
  const [confirmPassword, setConfirmPassword] = useState ('');
  const [message, setMessage] = useState (null);
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [role, setRole] = useState('Student');
  const [roles] = useState(['Student', 'Parent']);
  const [dependent, setDependent] = useState ('');
  const [phone, setPhone] = useState ('');
  const [address, setAddress] = useState ('');
  const [city, setCity] = useState ('');
  const [state, setState] = useState ('');
  const [country, setCountry] = useState ('');
  const [zip, setZip] = useState ('');
  const [school, setSchool] = useState ('');
  const [grades] = useState(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
  const [gradeInSchoolYear, setGradeInSchoolYear] = useState ('');

  const dispatch = useDispatch ();

  const userRegister = useSelector (state => state.userRegister);
  const {loading, error, userInfo} = userRegister;

  const redirect = location.search ? location.search.split ('=')[1] : '/';

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
    if (password !== confirmPassword) {
      setMessage ('Passwords do not match');
    } else {
      if (role === 'Parent') {
        if (dependent) {
          const dependents = dependent.split(';');
          // 邮箱格式验证
          if (!dependents.every(d => /\S+@\S+\.\S+/.test(d))) {
            setMessage ('Dependent email format error');
            return;
          }
        }
        if (!phone) {
          setMessage ('Phone is required');
          return;
        }
      }
      if (role === 'Student') {
        if (!school) {
          setMessage ('School is required');
          return;
        }
        if (!gradeInSchoolYear) {
          setMessage ('Grade is required');
          return;
        }
      }
      if (!code) {
        setMessage ('Code is required');
        return;
      }
      dispatch (
        register ({
          name,
          email,
          password,
          role,
          dependent: dependent.trim(),
          code: Number(code),
          phone,
          address,
          city,
          state,
          country,
          zip,
          school,
          gradeInSchoolYear,
        })
      );
    }
  };
  

  const sendEmail = () => {
    setIsActive(true);
    setSeconds(60);
    axios.post('/login/sendEmail', {email: email})
      .catch(err => {
        dispatch({
          type: USER_REGISTER_FAIL,
          payload: err.msg
        })
      })
  }

  const changePhone = text => {
    const phoneNumber = text.replace(/\D/g, '');
    const formattedPhoneNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    setPhone(formattedPhoneNumber);
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
      <h1>Sign Up</h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
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
          <Form.Label style={{ width: '100%' }}>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={e => setEmail (e.target.value.toLocaleLowerCase())}
            style={{ width: 'calc(100% - 180px)', display: 'inline-block'}}
          />
          <Button variant="primary" onClick={sendEmail} disabled={isActive} style={{ height: '45px', width: '180px', padding: '0' }}>
            {isActive ? `${seconds}s` : 'Send verification code'}
          </Button>
        </Form.Group>

        <Form.Group controlId="code">
          <Form.Label>Enter Verification Code from Your Email</Form.Label>
          <Form.Control
            placeholder="Enter verification code"
            value={code}
            onChange={e => setCode (e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="Role">
          <Form.Label>{`Role is(Please contact admin to change your role): ${role}`}</Form.Label>
          {/* <Form.Control
            as="select"
            defaultValue={role}
            onChange={e => setRole (e.target.value)}
            custom
          >
            <option>{role}</option>
            <option value="Student">Student</option>
            <option value="Parent">Parent</option>
          </Form.Control> */}
          <div>
            {
              roles.map(r => (
                <Form.Check
                  type="radio"
                  id={`role-${r}`}
                  label={r}
                  checked={r === role}
                  onChange={() => setRole(r)}
                />
              ))
            }
          </div>
        </Form.Group>

        <Form.Group controlId="dependent">
          <Form.Label>
            { role === 'Student' ? 'Parent' : 'Student' } email:
          </Form.Label>
          <Form.Control
            type="name"
            placeholder="When multiple dependents, use semicolons to seperate"
            value={dependent}
            onChange={e => setDependent (e.target.value)}
          />
        </Form.Group>
        
        {
          role === 'Parent' && (
            <Form.Group controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number, e.g. 617-111-1111"
                value={phone}
                maxLength={12}
                onChange={e => changePhone(e.target.value)}
              />
            </Form.Group>
          )
        }

        {
          role === 'Parent' && (
            <div>
              <Form.Group controlId="address">
                <Form.Label>Street Address(Optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="state">
                <Form.Label>State / Province</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter state / province"
                  value={state}
                  onChange={e => setState(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="country">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter country"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="zip">
                <Form.Label>Zip</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter zip"
                  value={zip}
                  onChange={e => setZip(e.target.value)}
                />
              </Form.Group>
            </div>
          )
        }

        {
          role === 'Student' && (
            <div>
              <Form.Group controlId="school">
                <Form.Label>School Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter school"
                  value={school}
                  onChange={e => setSchool(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="gradeInSchoolYear">
                <Form.Label>Grade in school year</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue={gradeInSchoolYear}
                  onChange={e => setGradeInSchoolYear(e.target.value)}
                  custom
                >
                  {
                    grades.map((year, index) => (
                      <option key={index}>{year}</option>
                    ))
                  }
                </Form.Control>
              </Form.Group>
            </div>
          )
        }

        <Form.Group controlId="password">
          <Form.Label>Create Password</Form.Label>
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

        <Button type="submit" variant="primary">
          Register
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Have an Account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
