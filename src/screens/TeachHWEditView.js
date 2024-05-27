import React, { useState, useEffect, useRef } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Form, Table, Button, Row, Col, Container, Modal, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { HW_UPDATE_RESET } from '../constants/hwConstants';
import { getEditorConfig, toolbarConfig } from '../config/editor-config';
import 'react-datepicker/dist/react-datepicker.css';

import { questionDetails } from '../actions/questionAction';
import { getCorrectDetail } from '../utils/correct';

import {
  getHwDetails,
  listTeacherHWs,
  updateHW,
  addQToHW,
  deleteQFromHW,
} from '../actions/hwActions';
import axios from '../utils/axios';

const options = ['A', 'B', 'C', 'D'];

const TeachHWEditView = ({ history, match }) => {
  const hwId = match.params.id;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [numQuestions, setNumQuestions] = useState(0);
  // const [isPublish, setIsPublish] = useState(false);
  const [language, setLanguage] = useState('en');
  const [editor, setEditor] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [dueDate, setDueDate] = useState(new Date());


  const [errorAddQLocal, seterrorAddQLocal] = useState('');

  const dispatch = useDispatch();

  // const hwDetail = useSelector(state => state.hwDetails);
  // const { loading, error, hw: hwInfo } = hwDetail;

  // const hwUpdated = useSelector(state => state.hwUpdate);
  // const {
  //   loading: loadingUpdate,
  //   error: errorUpdate,
  //   success: successUpdate,
  // } = hwUpdated;

  // const questionAdded = useSelector(state => state.hwAddQ);
  // const {
  //   loading: loadingAddQ,
  //   error: errorAddQ,
  //   success: successAddQ,
  // } = questionAdded;

  // const qDetails = useSelector(state => state.questionDetails);
  // const { loading: loadingSearch, error: errorSearch, question } = qDetails;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  const isTeacher = userInfo.role === 'Teacher';

  // const deletedQuestion = useSelector(state => state.hwDeleteQ);
  // const { success: successDeleteQ } = deletedQuestion;

  const [questions, setQuestions] = useState([]);
  const [hwInfo, setHwInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [question, setQuestion] = useState({});
  const questionList = useRef([]);
  const [allChecked, setAllChecked] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [bindQuestions, setBindQuestions] = useState([]);
  const [allBindChecked, setAllBindChecked] = useState(false);
  const [visible, setVisible] = useState(false);

  // useEffect(
  //   () => {
  //     if (successUpdate) {
  //       dispatch({ type: HW_UPDATE_RESET });
  //       dispatch(getHwDetails(hwId));
  //       dispatch(listTeacherHWs());
  //     } else {
  //       if (!userInfo || !isTeacher) {
  //         history.push('/login');
  //       } else {
  //         if (!hwInfo || hwInfo._id !== hwId) {
  //           dispatch(getHwDetails(hwId));
  //         } else {
  //           setName(hwInfo.name);
  //           setDescription(hwInfo.description);
  //           setNumQuestions(hwInfo.numQuestions);
  //           setIsPublish(hwInfo.isPublish);
  //           setLanguage(hwInfo.language);
  //           setDueDate(new Date(hwInfo.dueDate ? hwInfo.dueDate : Date.now()));
  //         }
  //       }
  //     }
  //   },
  //   [dispatch, history, hwId, hwInfo, successUpdate, qDetails, successAddQ, errorAddQLocal, successDeleteQ, question, userInfo, isTeacher]
  // );

  const submitHandler = e => {
    e.preventDefault();

    const updateHWInfo = {
      _id: hwId,
      name,
      description,
      // isPublish,
      numQuestions,
      language,
      dueDate,
    };
    // dispatch(updateHW(updateHWInfo));
    setLoading(true);
    axios.post(`/teacher/updateHW`, updateHWInfo)
      .then(res => {
        setLoading(false);
      }).catch(err => {
        setLoading(false);
        setError(err.msg);
      });
  };

  // const searchQuHandler = e => {
  //   e.preventDefault();
  //   seterrorAddQLocal('');
  //   dispatch(questionDetails(keyword));
  // };

  // const addHandler = e => {
  //   e.preventDefault();
  //   if (question) {
  //     const questionInfo = {
  //       QId: question._id,
  //       name: question.name,
  //       qText: question.qText,
  //       image: question.image,
  //       showImg: question.showImg,
  //       isChoice: question.isChoice,
  //       answerA: question.answerA,
  //       answerB: question.answerB,
  //       answerC: question.answerC,
  //       answerD: question.answerD,
  //       answerE: question.answerE,
  //       numChoice: question.numChoice,
  //       correctAnswer: question.correctAnswer,
  //       difficuty: question.difficuty,
  //       description: question.description,
  //       source: question.source,
  //       copyright: question.copyright,
  //     };
  //     //  console.log ('dispatch addQToHW conl hwId=', hwId);
  //     dispatch(addQToHW(hwId, questionInfo));
  //     setKeyword('');

  //     dispatch({ type: HW_UPDATE_RESET });
  //   } else {
  //     seterrorAddQLocal('Question ID is empty.');
  //   }
  // };

  // const deleteQfromHWHandler = q => {
  //   if (window.confirm('Are you sure')) {
  //     dispatch(deleteQFromHW(hwInfo._id, q));
  //   }
  //   dispatch(getHwDetails(hwId));
  // };

  const editorConfig = getEditorConfig();

  const getQuestions = (bq) => {
    axios.post('/teacher/getQuestionsByTeacher', {
      language: window.localStorage.getItem('lang') || 'en',
    }).then(res => {
      let list = res.result.list;
      list.forEach(q => {
        q.checked = false;
      });
      if (bq && bq.length > 0) {
        // 去重
        const bindQIds = bq.map(q => q._id);
        for (let i = 0; i < list.length; i++) {
          if (bindQIds.includes(list[i]._id)) {
            list.splice(i, 1);
            i--;
          }
        }
      }
      let filterList = list;
      if (searchText) {
        filterList = list.filter(q => q.name.toLowerCase().includes(searchText));
      }
      setQuestions([...filterList]);
      questionList.current = [...list];
    });
  };

  const getHomeworkDetail = () => {
    axios.post(`/user/getHWById`, { id: hwId }).then(res => {
      const hwInfo = res.result;
      setHwInfo(hwInfo);
      setName(hwInfo.name);
      setDescription(hwInfo.description);
      setNumQuestions(hwInfo.numQuestions);
      // setIsPublish(hwInfo.isPublish);
      setLanguage(hwInfo.language);
      setDueDate(new Date(hwInfo.dueDate ? hwInfo.dueDate : Date.now()));
      setBindQuestions(hwInfo.questionList);
      getQuestions(hwInfo.questionList);
    });
  }

  const getBindQuestions = () => {
    axios.post(`/user/getHWById`, { id: hwId }).then(res => {
      const hwInfo = res.result;
      setBindQuestions(hwInfo.questionList);
      getQuestions(hwInfo.questionList);
    });
  }

  const selectQuestion = (id) => {
    const list = [...questions];
    const q = list.find(q => q._id === id);
    q.checked = !q.checked;
    const q2 = questionList.current.find(q => q._id === id);
    q2.checked = q.checked;
    setQuestions(list);
  }

  const allSelect = () => {
    const list = [...questions];
    list.forEach(q => {
      q.checked = !allChecked;
      const q2 = questionList.current.find(q2 => q2._id === q._id);
      q2.checked = q.checked;
    });

    setQuestions(list);
    setAllChecked(!allChecked);
  }

  const batchAdd = () => {
    const list = [...questionList.current];
    const QIds = list.filter(q => q.checked).map(q => q._id);
    if (QIds.length === 0) {
      return;
    }
    axios.post(`/teacher/batchAddQToHW`, { id: hwId, QIds }).then(res => {
      getBindQuestions();
    });
  }

  const selectBindQuestion = (id) => {
    const list = [...bindQuestions];
    const q = list.find(q => q._id === id);
    q.checked = !q.checked;
    setBindQuestions(list);
  }

  const allBindSelect = () => {
    const list = [...bindQuestions];
    list.forEach(q => {
      q.checked = !allBindChecked;
    });
    setBindQuestions(list);
    setAllBindChecked(!allBindChecked);
  }

  const batchDelete = () => {
    const list = [...bindQuestions];
    const QIds = list.filter(q => q.checked).map(q => q._id);
    if (QIds.length === 0) {
      return;
    }
    axios.post(`/teacher/batchDeleteQFromHW`, { id: hwId, QIds }).then(res => {
      const hwInfo = res.result;
      setBindQuestions(hwInfo.questionList);
      getQuestions(hwInfo.questionList);
    });
  }

  const closePreviewModal = () => {
    setVisible(false);
  }

  const openPreviewModal = () => {
    setVisible(true);
  }

  const linkDetail = (id) => {
    window.open(`/teach/question/${id}/edit`, '_blank');
  }

  const upBindQuestion = (e, index) => {
    e.stopPropagation();
    const newList = [...bindQuestions];
    if (index === 0) {
      return;
    }
    const temp = newList[index];
    newList[index] = newList[index - 1];
    newList[index - 1] = temp;
    axios.post(`/teacher/setQFormHW`, { id: hwId, questionList: newList }).then(res => {
      getBindQuestions();
    });
  }

  const downBindQuestion = (e, index) => {
    e.stopPropagation();
    const newList = [...bindQuestions];
    if (index === newList.length - 1) {
      return;
    }
    const temp = newList[index];
    newList[index] = newList[index + 1];
    newList[index + 1] = temp;
    axios.post(`/teacher/setQFormHW`, { id: hwId, questionList: newList }).then(res => {
      getBindQuestions();
    });
  }

  useEffect(() => {
    if (!searchText) {
      setQuestions([...questionList.current]);
    } else {
      const list = [...questionList.current];
      const newList = list.filter(q => q.name.toLowerCase().includes(searchText.toLowerCase()));
      setQuestions(newList);
    }
  }, [searchText]);

  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);

    }
  }, [editor]);

  useEffect(() => {
    getHomeworkDetail();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>

      <Link to="/teach/hwlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <Row className="justify-content-md-center">
        <Col md={8}>

          <h2> Edit Home Work </h2>
          {/* {(loadingUpdate || loading) && <Loader />} */}
          {/* {(errorUpdate || error) && <Message variant="danger">{errorUpdate || error}</Message>} */}

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

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              {/* <Form.Control
                        as="textarea"
                        rows={2}
                        value={description}
                        onChange={e => setDescription (e.target.value)}
                      /> */}
              <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                <Toolbar
                  editor={editor}
                  defaultConfig={toolbarConfig}
                  mode="default"
                  style={{ borderBottom: '1px solid #ccc' }}
                />
                <Editor
                  defaultConfig={editorConfig}
                  value={description}
                  onCreated={setEditor}
                  onChange={editor => setDescription(editor.getHtml())}
                  mode="default"
                  style={{ height: '500px', overflowY: 'hidden' }}
                />
              </div>
            </Form.Group>

            <Form.Group controlId="Due Date: ">
              <Form.Label>Due Date:</Form.Label>
              <DatePicker
                selected={dueDate}
                onChange={date => {
                  setDueDate(date);
                }}
                name="Due Date: "
                timeIntervals={20}
                timeCaption="time"
                dateFormat="MMMM d, yyyy "
                className="form-control"
              />
            </Form.Group>

            <Form.Group controlId="language">
              <Form.Label>Language</Form.Label>
              <Form.Control
                as="select"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                <option>{language}</option>
                <option value="en">en</option>
                <option value="zh">zh</option>
              </Form.Control>
            </Form.Group>

            {/* <Form.Group controlId="isPublish">
              <Form.Check
                type="checkbox"
                label="Publish question to classroom?"
                checked={isPublish}
                onChange={e => setIsPublish(e.target.checked)}
              />
            </Form.Group> */}

            <Button type="submit" variant="primary" style={{ marginRight: '10px' }} disabled={loading}>
              {
                loading ? <Spinner animation="border" size="sm" /> : 'Update'
              }
            </Button>
            <Button variant="primary" onClick={openPreviewModal}>
              Preview
            </Button>
          </Form>
        </Col>
      </Row>
      <h3 style={{ marginTop: '40px' }}> Add questions to homework </h3>
      <h4 style={{ marginBottom: '30px' }}>
        {`Number of HomeWork in this class: ${bindQuestions.length}`}
      </h4>
      <div className='transfer-container'>
        <div className='transfer-content'>
          <div className='transfer-content-header'>
            <input type='checkbox' checked={allChecked} onClick={allSelect} />
          </div>
          <div className='transfer-search'>
            <Form.Control
              type="text"
              placeholder="question name"
              value={searchText}
              onChange={e => setSearchText(e.target.value)} />
          </div>
          <div className='transfer-list'>
            {
              questions.map((q, index) => (
                <div className='transfer-list-item' key={q._id} onClick={() => selectQuestion(q._id)}>
                  <input type='checkbox' checked={q.checked} />
                  <div className='transfer-list-text'>{q.name}({q._id})</div>
                </div>
              ))
            }
          </div>
        </div>
        <div className='transfer-btns'>
          <Button type="submit" variant="primary" onClick={batchDelete}>
            <i className="fas fa-arrow-left" />
          </Button>
          <Button type="submit" variant="primary" onClick={batchAdd}>
            <i className="fas fa-arrow-right" />
          </Button>
        </div>
        <div className='transfer-content'>
          <div className='transfer-content-header'>
            <input type='checkbox' checked={allBindChecked} onClick={allBindSelect} />
          </div>
          <div className='transfer-list'>
            {
              bindQuestions.map((q, index) => (
                <div className='transfer-list-item' key={q._id} onClick={() => selectBindQuestion(q._id)}>
                  <input type='checkbox' checked={q.checked} />
                  <div className='transfer-list-text'>{q.name}({q._id})</div>
                  <div>
                    {
                      index > 0 && <i className="fas fa-arrow-up mr-2" onClick={(e) => upBindQuestion(e, index)} />
                    }
                    {
                      index !== bindQuestions.length - 1 && <i className="fas fa-arrow-down" onClick={(e) => downBindQuestion(e, index)} />
                    }
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <Modal show={visible} onHide={closePreviewModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='question'>
            <div className='question-title' style={{ marginTop: '0' }}>{name}</div>
            <div className='question-level'>Due Date: {dueDate.toISOString()}</div>
            <div className='question-content' dangerouslySetInnerHTML={{ __html: description }}></div>
          </div>
          <h4 style={{ marginTop: '40px' }}>Questions</h4>
          {/* <Table style={{ marginTop: '30px' }}>
            <thead>
              <tr>
                <th>name</th>
                <th>id</th>
              </tr>
            </thead>
            <tbody>
              {
                bindQuestions.map((q, index) => (
                  <tr key={q._id}>
                    <td>{q.name}</td>
                    <td>{q._id}</td>
                  </tr>
                ))
              }
            </tbody>
          </Table> */}
          <div>
            {
              bindQuestions.map((question, index) => {
                return (
                  <div className='question question-border' key={question._id}>
                    <div className='question-title' style={{ fontSize: '16px' }}>Question {index + 1} <i className="fas fa-edit" style={{ fontSize: '16px', cursor: 'pointer', color: '#4d85ff' }} onClick={() => linkDetail(question._id)} /></div>
                    <div className='question-level'>level: {question.difficuty}</div>
                    <div className='question-content' dangerouslySetInnerHTML={{ __html: question.qText }}></div>
                    {
                      question.isChoice === '0' && (
                        <div className='question-options'>
                          {
                            options.map((option, index) => (
                              <Form.Check key={option} type="radio">
                                <Form.Check.Input
                                  type="radio"
                                  id={`answer${option}`}
                                  checked={false}
                                  disabled />
                                <Form.Check.Label for={`answer${option}`}>
                                  <div className='question-option'>
                                    <div className='label'>{`${option}.`}</div>
                                    <div className='value' dangerouslySetInnerHTML={{
                                      __html
                                        : question[`answer${option}`]
                                    }}></div>
                                  </div>
                                </Form.Check.Label>
                              </Form.Check>
                            ))
                          }
                          {
                            Number(question.numChoice) > 4 && (
                              <Form.Check type="radio">
                                <Form.Check.Input
                                  type="radio"
                                  id="answerE"
                                  checked={false}
                                  disabled />
                                <Form.Check.Label for="answerE">
                                  <div className='question-option'>
                                    <div className='label'>E.</div>
                                    <div className='value' dangerouslySetInnerHTML={{
                                      __html
                                        : question[`answerE`]
                                    }}></div>
                                  </div>
                                </Form.Check.Label>
                              </Form.Check>
                            )
                          }
                        </div>
                      )
                    }
                    {
                      question.isChoice === '1' && (
                        <div className='question-options'>
                          {
                            options.map((option, index) => (
                              <Form.Check key={option} type="checkbox">
                                <Form.Check.Input
                                  type="checkbox"
                                  id={`answer${option}`}
                                  checked={false}
                                  disabled />
                                <Form.Check.Label for={`answer${option}`}>
                                  <div className='question-option'>
                                    <div className='label'>{`${option}.`}</div>
                                    <div className='value' dangerouslySetInnerHTML={{
                                      __html
                                        : question[`answer${option}`]
                                    }}></div>
                                  </div>
                                </Form.Check.Label>
                              </Form.Check>
                            ))
                          }
                          {
                            Number(question.numChoice) > 4 && (
                              <Form.Check type="checkbox">
                                <Form.Check.Input
                                  type="checkbox"
                                  id="answerE"
                                  checked={false}
                                  disabled />
                                <Form.Check.Label for="answerE">
                                  <div className='question-option'>
                                    <div className='label'>E.</div>
                                    <div className='value' dangerouslySetInnerHTML={{
                                      __html
                                        : question[`answerE`]
                                    }}></div>
                                  </div>
                                </Form.Check.Label>
                              </Form.Check>
                            )
                          }
                        </div>
                      )
                    }
                    {
                      question.isChoice === '2' && (
                        <div className='question-textarea'>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            disabled
                          />
                        </div>
                      )
                    }
                    <div className='question-correct'>Correct Answer: {question.correctAnswer}</div>
                  </div>
                )
              })
            }
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default TeachHWEditView;
