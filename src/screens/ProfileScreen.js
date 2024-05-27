import React, {useState, useEffect} from 'react';
import {Table, Form, Button, Row, Col} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from 'react-datepicker';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {getUserDetails, updateUserProfile} from '../actions/userActions';
//import {listMyOrders} from '../actions/orderActions';
import {USER_UPDATE_PROFILE_RESET} from '../constants/userConstants';
import axios from '../utils/axios';

// const years = [];
// for (let i = 0; i < 20; i++) {
//   years.push(`${i + 2012}-${i + 2013}`);
// }

const ProfileScreen = ({location, history}) => {
  const [name, setName] = useState ('');
  const [email, setEmail] = useState ('');
  const [role, setRole] = useState ('');
  const [roles] = useState(['Student', 'Parent']);
  const [dependent, setDependent] = useState ('');

  const [password, setPassword] = useState ('');
  const [confirmPassword, setConfirmPassword] = useState ('');
  const [message, setMessage] = useState (null);
  const [phone, setPhone] = useState ('');
  const [address, setAddress] = useState ('');
  const [city, setCity] = useState ('');
  const [state, setState] = useState ('');
  const [country, setCountry] = useState ('');
  const [zip, setZip] = useState ('');
  const [school, setSchool] = useState ('');
  const [gradeInSchoolYear, setGradeInSchoolYear] = useState ('');
  const [nowGradeYear, setNowGradeYear] = useState ('');
  const [grades] = useState(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);

  const dispatch = useDispatch ();

  const userDetails = useSelector (state => state.userDetails);
  const {loading, error, user} = userDetails;

  const userLogin = useSelector (state => state.userLogin);
  const {userInfo} = userLogin;

  const userUpdateProfile = useSelector (state => state.userUpdateProfile);
  const {success, error: updateError} = userUpdateProfile;

  const [code, setCode] = useState ('');
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [currentPassword, setCurrentPassword] = useState ('');
  // const [birthday, setBirthday] = useState ('');

  // let birthdayObj;
  // if (birthday) {
  //   let timestamps = Date.parse(birthday);
  //   birthdayObj = new Date(timestamps);
  // }

  //const orderListMy = useSelector((state) => state.orderListMy)
  //const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

  useEffect (
    () => {
      if (!userInfo) {
        history.push ('/login');
      } else {
        //      if (!user || !user.name || success) {
        if (!user || !user.name || success) {
          dispatch ({type: USER_UPDATE_PROFILE_RESET});
          dispatch (getUserDetails ('profile'));
          //     dispatch (listMyOrders ());
        } else {
          setName (user.name);
          setEmail (user.email);
          setRole (user.role);
          setDependent (user.dependent);
          // setBirthday (user.birthday);
          setPhone (user.phone);
          setAddress (user.address);
          setCity (user.city);
          setState (user.state);
          setCountry (user.country);
          setZip (user.zip);
          setSchool (user.school);
          setGradeInSchoolYear (user.gradeInSchoolYear);
          if (user.gradeInSchoolYearAt) {
            // 对比当前时间和gradeInSchoolYearAt
            const now = new Date();
            const nowYear = now.getFullYear();
            const gradeInSchoolYearAt = new Date(user.gradeInSchoolYearAt);
            const gradeInSchoolYearAtYear = gradeInSchoolYearAt.getFullYear();
            let year = nowYear - gradeInSchoolYearAtYear;
            // 当前时间如果超过9月1日并且gradeInSchoolYearAt小于9月1日，那么就是新的一年，年级要加1
            if (now >= new Date(nowYear, 8, 1) && gradeInSchoolYearAt < new Date(gradeInSchoolYearAtYear, 8, 1)) {
              year += 1;
            }
            // const [start, end] = user.gradeInSchoolYear.split('-');
            setNowGradeYear(`${Number(user.gradeInSchoolYear) + year}`);
          } else {
            setNowGradeYear ('');
          }
        }
      }
    },
    [dispatch, history, userInfo, user, success]
    // [] // eslint-disable-line react-hooks/exhaustive-deps
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
        // if (!birthday) {
        //   setMessage ('Birthday is required');
        //   return;
        // }
        if (!school) {
          setMessage ('School is required');
          return;
        }
        if (!gradeInSchoolYear) {
          setMessage ('Grade is required');
          return;
        }
      }
      if (password && !currentPassword) {
        setMessage ('Current password is required');
        return;
      }
      if (!code) {
        setMessage ('Code is required');
        return;
      }
      dispatch (
        updateUserProfile ({
          id: user._id,
          name,
          email,
          password,
          role,
          dependent: dependent.trim(),
          // birthday,
          currentPassword,
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
        setMessage(err.msg)
      })
  }

  const changePhone = text => {
    const phoneNumber = text.replace(/\D/g, '');
    const formattedPhoneNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    setPhone(formattedPhoneNumber);
  }

  const changeGradeYear = text => {
    setGradeInSchoolYear(text);
    setNowGradeYear(text);
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
    <Row>
      <Col md={6}>
        <h2>User Profile</h2>
        {message && <Message variant="danger">{message}</Message>}
        {success && <Message variant="success">Profile Updated</Message>}
        {updateError && <Message variant="danger">{updateError}</Message>}
        {loading
          ? <Loader />
          : error
              ? <Message variant="danger">{error}</Message>
              : <Form onSubmit={submitHandler}>
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
                      disabled={userInfo.role === 'Parent' || userInfo.role === 'Student'}
                      onChange={e => setEmail (e.target.value.toLocaleLowerCase())}
                      style={{ width: 'calc(100% - 82px)', display: 'inline-block'}}
                    />
                    <Button variant="primary" onClick={sendEmail} disabled={isActive} style={{ height: '45px', width: '82px' }}>
                      {isActive ? `${seconds}s` : 'Send'}
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
                            disabled
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

                  {/* {
                    (userInfo.role === 'Student' || userInfo.role === 'Parent') && (
                      <Form.Group controlId="birthday">
                        <Form.Label>Birthday</Form.Label>
                        <DatePicker
                          selected={birthdayObj}
                          onChange={date => {
                            setBirthday(date);
                          }}
                          name="brithday: "
                          timeIntervals={20}
                          timeCaption="time"
                          dateFormat="MMMM d, yyyy "
                          className="form-control"
                        />
                      </Form.Group>
                    )
                  } */}

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
                          <Form.Label>Street Address</Form.Label>
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
                            defaultValue={nowGradeYear}
                            onChange={e => changeGradeYear(e.target.value)}
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

                  <Form.Group controlId="currentPassword">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword (e.target.value)}
                    />
                  </Form.Group>

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
                    Update Profile
                  </Button>
                </Form>}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
