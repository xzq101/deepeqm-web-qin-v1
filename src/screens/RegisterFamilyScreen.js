import React, {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import {Form, Button, Row, Col} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import { useSnackbar } from 'notistack';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import axios from '../utils/axios';
import { USER_REGISTER_FAIL } from '../constants/userConstants';

const RegisterFamilyScreen = ({location, history}) => {
  const [name, setName] = useState ('');
  const [email, setEmail] = useState ('');
  const [code, setCode] = useState ('');
  const [password, setPassword] = useState ('');
  const [confirmPassword, setConfirmPassword] = useState ('');
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
  const [gradeInSchoolYear, setGradeInSchoolYear] = useState ('1');

  const [parentName, setParentName] = useState ('');
  const [parentEmail, setParentEmail] = useState ('');
  const [parentPassword, setParentPassword] = useState ('');
  const [confirmParentPassword, setConfirmParentPassword] = useState ('');
  const [isRegistered, setIsRegistered] = useState (false);

  const [studentName, setStudentName] = useState ('');
  const [studentEmail, setStudentEmail] = useState ('');
  const [studentPassword, setStudentPassword] = useState ('');
  const [confirmStudentPassword, setConfirmStudentPassword] = useState ('');

  const dispatch = useDispatch ();
  const { enqueueSnackbar } = useSnackbar();

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
    if (!code) {
      enqueueSnackbar('Code is required', { variant: 'error' });
      return;
    }
    if (!parentName) {
      enqueueSnackbar('Parent Name is required', { variant: 'error' });
      return;
    }
    if (!phone) {
      enqueueSnackbar('Phone is required', { variant: 'error' });
      return;
    }
    if (!isRegistered && !parentPassword) {
      enqueueSnackbar('Parent Password is required', { variant: 'error' });
      return;
    }
    if (!isRegistered && parentPassword !== confirmParentPassword) {
      enqueueSnackbar('Parents\'s passwords do not match', { variant: 'error' });
      return;
    }
    if (!studentName) {
      enqueueSnackbar('Student Name is required', { variant: 'error' });
      return;
    }
    if (!studentEmail) {
      enqueueSnackbar('Student Email is required', { variant: 'error' });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(studentEmail)) {
      enqueueSnackbar('Invalid email', { variant: 'error' });
      return;
    }
    if (parentEmail === studentEmail) {
      enqueueSnackbar('Parent and Student email should be different', { variant: 'error' });
      return;
    }
    if (!school) {
      enqueueSnackbar('School is required', { variant: 'error' });
      return;
    }
    if (!gradeInSchoolYear) {
      enqueueSnackbar('Grade is required', { variant: 'error' });
      return;
    }
    if (!studentPassword) {
      enqueueSnackbar('Student Password is required', { variant: 'error' });
      return;
    }
    if (studentPassword !== confirmStudentPassword) {
      enqueueSnackbar('Student\'s passwords do not match', { variant: 'error' });
      return;
    }

    const parent = {
      name: parentName,
      email: parentEmail,
      password: parentPassword,
      phone,
      address,
      city,
      state,
      country,
      zip,
    };
    const student = {
      name: studentName,
      email: studentEmail,
      password: studentPassword,
      school,
      gradeInSchoolYear,
    };
    axios.post('/login/registerFamily', {parent, student, code: Number(code)})
      .then(() => {
        enqueueSnackbar('Register successfully', { variant: 'success' });
        setTimeout(() => {
          history.push('/login');
        }, 2000);
      })
      .catch(err => {
        enqueueSnackbar(err.msg, { variant: 'error' });
      });
  };
  

  const sendEmail = () => {
    setIsActive(true);
    setSeconds(60);
    axios.post('/login/sendEmail', {email: parentEmail})
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

  const validateEmail = () => {
    if (!code) {
      enqueueSnackbar('Code is required', { variant: 'error' });
      return;
    }
    axios.post('/login/validateEmailByCode', {email: parentEmail, code: Number(code)})
      .then(res => {
        if (res.result) {
          setPhone(res.result.phone);
          setAddress(res.result.address);
          setCity(res.result.city);
          setState(res.result.state);
          setCountry(res.result.country);
          setZip(res.result.zip);
          setParentName(res.result.name);
          setIsRegistered(true);
        } else {
          setIsRegistered(false);
        }
        enqueueSnackbar('Email is validated', { variant: 'success' });
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
      <h1>Sign Up</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler} style={{ marginTop: '50px' }}>
        <h2 className='mt-2'>Parent</h2>
        <Form.Group controlId="parentEmail">
          <Form.Label style={{ width: '100%' }}>Parent Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Parent email"
            value={parentEmail}
            onChange={e => setParentEmail (e.target.value.toLocaleLowerCase())}
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
            style={{ width: 'calc(100% - 100px)', display: 'inline-block'}}
          />
          <Button variant="primary" onClick={validateEmail} style={{ height: '45px', width: '100px', padding: '0' }}>
            Validate
          </Button>
        </Form.Group>
        <Form.Group controlId="parentName">
          <Form.Label>Parent Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter Parent name"
            value={parentName}
            disabled={isRegistered}
            onChange={e => setParentName (e.target.value)}
          />
        </Form.Group>
        
        <Form.Group controlId="phone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter phone number, e.g. 617-111-1111"
                value={phone}
                disabled={isRegistered}
                maxLength={12}
                onChange={e => changePhone(e.target.value)}
            />
        </Form.Group>

        <Form.Group controlId="address">
            <Form.Label>Street Address(Optional)</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter address"
                value={address}
                disabled={isRegistered}
                onChange={e => setAddress(e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter city"
                value={city}
                disabled={isRegistered}
                onChange={e => setCity(e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId="state">
            <Form.Label>State / Province</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter state / province"
                value={state}
                disabled={isRegistered}
                onChange={e => setState(e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter country"
                value={country}
                disabled={isRegistered}
                onChange={e => setCountry(e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId="zip">
            <Form.Label>Zip</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter zip"
                value={zip}
                disabled={isRegistered}
                onChange={e => setZip(e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId="parentPassword">
          <Form.Label>Create Parent Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Parent password"
            value={parentPassword}
            disabled={isRegistered}
            onChange={e => setParentPassword (e.target.value)}
          />
          {
            isRegistered && <span style={{ fontSize: '12px' }}>（If already registered, there is no need to fill in the form）</span>
          }
        </Form.Group>

        <Form.Group controlId="confirmParentPassword">
          <Form.Label>Confirm Parent Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Parent password"
            value={confirmParentPassword}
            disabled={isRegistered}
            onChange={e => setConfirmParentPassword (e.target.value)}
          />
          {
            isRegistered && <span style={{ fontSize: '12px' }}>（If already registered, there is no need to fill in the form）</span>
          }
        </Form.Group>

        <h2 className='mt-2'>Student</h2>

        <Form.Group controlId="studentName">
          <Form.Label>Stuent Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter Stuent name"
            value={studentName}
            onChange={e => setStudentName (e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="studentEmail">
          <Form.Label style={{ width: '100%' }}>Student Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Student email"
            value={studentEmail}
            onChange={e => setStudentEmail (e.target.value.toLocaleLowerCase())}
          />
        </Form.Group>

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
        <Form.Group controlId="studentPassword">
          <Form.Label>Create Student Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Student password"
            value={studentPassword}
            onChange={e => setStudentPassword (e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="confirmStudentPassword">
          <Form.Label>Confirm Student Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Student password"
            value={confirmStudentPassword}
            onChange={e => setConfirmStudentPassword (e.target.value)}
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

export default RegisterFamilyScreen;
