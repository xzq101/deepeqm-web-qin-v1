import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Form, Button, Row, Modal, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { listMyClasses } from '../actions/registerAction';
import Message from '../components/Message';
import Loader from '../components/Loader';

const MyClassesView = ({ location, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const myClassList = useSelector(state => state.myClassList);
  const {
    loading: loadingMyClasses,
    error: errorMyClasses,
    myClasses,
  } = myClassList;
  

  const openHomeworkModal = (id) => {
    history.push(`/myHomework/${id}`);
  };

  const getExpiredTime = (myClass) => {
    const { classInfo, expirationDate } = myClass;
    const { classID } = classInfo;
    const { includeLibrary, endDate } = classID;
    if (includeLibrary) {
      return new Date(expirationDate).toLocaleString();
    } else {
      // 取 endDate 和 expirationDate 中较晚的时间
      const expiredTime = new Date(Math.max(new Date(endDate), new Date(expirationDate)));
      return expiredTime.toLocaleString();
    }
  }

  useEffect(
    () => {
      if (!userInfo) {
        history.push('/login');
      } else {
        dispatch(listMyClasses());
      }
    },
    [dispatch, history, userInfo]
  );

  return (
    <Row>

      <h2>My Classes</h2>
      {loadingMyClasses
        ? <Loader />
        : errorMyClasses
          ? <Message variant="danger">{errorMyClasses}</Message>
          : <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>NAME</th>
                <th>Expired Time</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {myClasses.map(myClass => (
                <tr key={myClass._id}>

                  <td>{myClass.classInfo.name}</td>
                  <td>{getExpiredTime(myClass)}</td>
                  <td>
                    <Button variant="info" className="btn-sm" onClick={() => openHomeworkModal(myClass.classInfo.classID._id)}>
                      start learning
                    </Button>
                  </td>

                </tr>
              ))}
            </tbody>
          </Table>}
    </Row>
  );
};

export default MyClassesView;
