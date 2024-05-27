import React, {useEffect, useState} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Table, Button, Row, Col, Container, Form} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
//import Paginate from '../components/Paginate'
import axios from '../utils/axios';
import {
  createQuestions,
  listTeacherQuestions,
  deleteQuestion,
} from '../actions/questionAction';

import {QUESTION_CREATE_RESET} from '../constants/questionConstants';

const TeachQuestionListView = ({history, match}) => {
  const dispatch = useDispatch ();

  const userLogin = useSelector (state => state.userLogin);
  const {userInfo} = userLogin;
  const isTeacher = userInfo.role === 'Teacher';
  //console.log ('isTeacher', isTeacher);

  const questionCreate = useSelector (state => state.questionCreate);
  const {
    loading: loadingCreateQ,
    error: errorCreateQ,
    success: successCreateQ,
    question,
  } = questionCreate;

  const questionList = useSelector (state => state.questionListForTeacher);
  const {
    loading: loadingList,
    error: errorList,
    questions: qList,
  } = questionList;

  const questionDelete = useSelector (state => state.questionDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = questionDelete;
  const [name, setName] = useState ('');

  useEffect (
    () => {
      dispatch ({type: QUESTION_CREATE_RESET});

      if (!userInfo || !isTeacher) {
        history.push ('/login');
      } else {
        dispatch (listTeacherQuestions ());
      }
    },
    [dispatch, history, userInfo, successCreateQ, successDelete, isTeacher]
  );

  const createQuestionHandler = () => {
    dispatch (createQuestions ());
  };

  const deleteQuestionHandler = id => {
    if (window.confirm ('Are you sure')) {
      dispatch (deleteQuestion (id));
    }
  };

  const searchQuestion = () => {
    dispatch (listTeacherQuestions (name));
  }

  const uploadFile = async e => {
    const file = e.target.files[0];
    // 判断是否是 excel
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      alert('Please upload excel file!');
      return;
    }
    const formData = new FormData ();
    formData.append ('file', file);
    formData.append ('type', 2);

    const res = await axios.post('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { path } = res.result;

    await axios.post('/teacher/batchCreateQuestion', {
      filePath: path,
      language: window.localStorage.getItem ('lang') || 'en',
    });

    dispatch (listTeacherQuestions ());
    document.getElementById('question-upload-file').value = '';
  }

  const copy = (id) => {
    axios.post('/teacher/copyQuestion', {
      id
    }).then(res => {
      dispatch (listTeacherQuestions ());
    })
  }

  return (
    <Container>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreateQ && <Loader />}
      {errorCreateQ && <Message variant="danger">{errorCreateQ}</Message>}
      <Row className="align-items-center">
        <Col>
          <h1>My Questions </h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" size="sm" onClick={createQuestionHandler} style={{ marginRight: '6px' }}>
            <i className="fas fa-plus" /> Create
          </Button>
          <Button className="my-3" size="sm" style={{ position: 'relative', marginRight: '6px' }}>
            <i className="fas fa-plus" /> Batch Create
            <input
              type='file'
              id="question-upload-file"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              style={{ opacity: 0, position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}
              onChange={uploadFile} />
          </Button>
          <Button variant="primary" size="sm" href="/api/question_template.xlsx">Download Template</Button>
        </Col>
      </Row>
      {loadingList
        ? <Loader />
        : errorList
            ? <Message variant="danger">{errorList}</Message>
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
                    <Button onClick={searchQuestion} variant="outline-success">
                      Search
                    </Button>
                  </Form.Group>
                </Form>
                {
                  qList.length > 0 ? (
                    <Table striped bordered hover responsive className="table-sm">
                      <thead>
                        <tr>

                          <th>Name</th>
                          <th>id</th>
                          <th>Category</th>
                          <th>Difficuty</th>

                          <th />

                        </tr>
                      </thead>
                      <tbody>
                        {qList.map (q => (
                          <tr key={q._id}>
                            <td>{q.name}</td>
                            <td>{q._id}</td>
                            <td>{q.category}</td>
                            <td>{q.difficuty}</td>

                            <td>
                              <LinkContainer to={`/teach/question/${q._id}/edit`}>
                                <Button variant="light" className="btn-sm">
                                  <i className="fas fa-edit" />
                                </Button>
                              </LinkContainer>
                              <Button variant="light" className="btn-sm" onClick={() => copy(q._id)}>
                                <i className="fas fa-copy" />
                              </Button>
                              <Button
                                variant="danger"
                                className="btn-sm"
                                onClick={() => deleteQuestionHandler (q._id)}
                              >
                                <i className="fas fa-trash" />
                              </Button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Message variant="info">
                      No question found, change language or search again
                    </Message>
                  )
                }
                
              </Container>}
    </Container>
  );
};

export default TeachQuestionListView;
