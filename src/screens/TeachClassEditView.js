import React, { useState, useEffect } from "react";
import Pagination from "@mui/lab/Pagination";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import {
    Form,
    Table,
    Button,
    Row,
    Col,
    Container,
    Spinner,
    Modal
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { CLASS_UPDATE_RESET } from "../constants/classConstants";
import { getEditorConfig, toolbarConfig } from "../config/editor-config";
import DatePicker from "react-datepicker";
import axios from "../utils/axios";

import "react-datepicker/dist/react-datepicker.css";

import {
    ShowClassDetails,
    updateClassByTeach,
    listTeacherClasses,
} from "../actions/classActions";

const TeachClassEditView = ({ history, match }) => {
    const classId = match.params.id;

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [language, setLanguage] = useState("en");
    const [editor, setEditor] = useState(null);
    const [registerLink, setRegisterLink] = useState("");
    const [introEditor, setIntroEditor] = useState(null);
    const [introduction, setIntroduction] = useState("");
    const [bulletin, setBulletin] = useState("");
    const [bulletinEditor, setBulletinEditor] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [errorUpdate, setErrorUpdate] = useState("");
    const [sources, setSources] = useState([]);
    const [sourceVisible, setSourceVisible] = useState(false);
    const [includeLibrary, setIncludeLibrary] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [sourceList, setSourceList] = useState([]);
    const [selectedSource, setSelectedSource] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [paymentInfo, setPaymentInfo] = useState('');
    const [paymentInfoEditor, setPaymentInfoEditor] = useState(null);

    let startDateObj = new Date();
    if (startDate) {
        let timestamps = Date.parse(startDate);
        startDateObj = new Date(timestamps);
    }

    let endDateObj = new Date();
    if (endDate) {
        let timestampe = Date.parse(endDate);
        endDateObj = new Date(timestampe);
    }

    // const dispatch = useDispatch();

    // const classDetail = useSelector(state => state.classDetails);
    // const { loading, error, tClass } = classDetail;

    // const classUpdate = useSelector(state => state.classUpdateByT);
    // const {
    //   loading: loadingUpdate,
    //   error: errorUpdate,
    //   success: successUpdate,
    // } = classUpdate;

    // const userLogin = useSelector(state => state.userLogin);
    // const { userInfo } = userLogin;
    // const isTeacher = userInfo.role === 'Teacher';

    // useEffect(
    //   () => {
    //     if (successUpdate) {
    //       dispatch({ type: CLASS_UPDATE_RESET });
    //       // dispatch(ShowClassDetails(classId));
    //       // dispatch(listTeacherClasses());
    //     } else {
    //       if (!userInfo || !isTeacher) {
    //         history.push('/login');
    //       } else {
    //         if (!tClass || tClass._id !== classId) {
    //           dispatch(ShowClassDetails(classId));
    //         } else {
    //           setName(tClass.name);
    //           setPrice(tClass.price);
    //           setImage(tClass.image);
    //           setCategory(tClass.category);
    //           setDescription(tClass.description);
    //           setStartDate(tClass.startDate);
    //           setEndDate(tClass.endDate);
    //           setLanguage(tClass.language);
    //           setRegisterLink(tClass.registerLink);
    //           setIntroduction(tClass.introduction);
    //         }
    //       }
    //     }
    //   },
    //   [dispatch, history, classId, tClass, successUpdate, userInfo, isTeacher]
    // );

    const getClassDetail = () => {
        axios.get(`/public/getClassById?id=${classId}`).then((res) => {
            const tClass = res.result;
            setName(tClass.name);
            setPrice(tClass.price);
            setImage(tClass.image);
            setCategory(tClass.category);
            setDescription(tClass.description);
            setStartDate(tClass.startDate);
            setEndDate(tClass.endDate);
            setLanguage(tClass.language);
            setRegisterLink(tClass.registerLink);
            setIntroduction(tClass.introduction);
            setBulletin(tClass.bulletin);
            if (tClass.source) {
                setSources(tClass.source);
                setSelectedSource(tClass.source.map(item => ({ id: item._id, name: item.name })))
            }
            setIncludeLibrary(tClass.includeLibrary);
            setPaymentInfo(tClass.paymentInfo);
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        // dispatch(
        //   updateClassByTeach({
        //     _id: classId,
        //     name,
        //     price,
        //     image,
        //     category,
        //     startDate,
        //     description,
        //     endDate,
        //     language,
        //     registerLink,
        //     introduction,
        //   })
        // );
        setLoadingUpdate(true);
        setErrorUpdate("");
        axios
            .post(`/teacher/updateClassIntro`, {
                _id: classId,
                name,
                price,
                image,
                category,
                startDate,
                description,
                endDate,
                language,
                registerLink,
                introduction,
                bulletin,
                source: selectedSource.map(s => s.id),
                includeLibrary,
                paymentInfo,
            })
            .then((res) => {
                setLoadingUpdate(false);
                const tClass = res.result;
                setName(tClass.name);
                setPrice(tClass.price);
                setImage(tClass.image);
                setCategory(tClass.category);
                setDescription(tClass.description);
                setStartDate(tClass.startDate);
                setEndDate(tClass.endDate);
                setLanguage(tClass.language);
                setRegisterLink(tClass.registerLink);
                setIntroduction(tClass.introduction);
                setBulletin(tClass.bulletin);
                // setSources(tClass.source);
                setIncludeLibrary(tClass.includeLibrary);
                setPaymentInfo(tClass.paymentInfo);
            })
            .catch((err) => {
                setLoadingUpdate(false);
                setErrorUpdate(err.msg);
            });
    };

    const selecteSource = (item) => {
      const ids = selectedSource.map(s => s.id);
      if (ids.includes(item._id)) {
          setSelectedSource(selectedSource.filter(s => s.id !== item._id));
      } else {
          setSelectedSource([...selectedSource, {
              id: item._id,
              name: item.name,
          }]);
      }
  }

  const changePage = (event, value) => {
      setPage(value);
  }

    const getSourceList = () => {
      axios.get('/user/getUserSource', {
          params: {
              page,
              keyword,
              pageSize,
          }
      }).then(res => {
          setSourceList(res.result.list);
          setTotal(res.result.total);
      })
  }

    const closeSourceModal = () => {
        setSourceVisible(false);
    };

    const openSourceModal = () => {
        setSourceVisible(true);
    };

    const searchSource = () => {
      if (page === 1) {
          getSourceList();
      } else {
          setPage(1);
      }
  }

  const selectSource = () => {
      setSourceVisible(false);
      setSources([...selectedSource]);
  }

    const editorConfig = getEditorConfig();

    useEffect(() => {
        return () => {
            if (editor == null) return;
            editor.destroy();
            setEditor(null);
        };
    }, [editor]);

    useEffect(() => {
        return () => {
            if (introEditor == null) return;
            introEditor.destroy();
            setIntroEditor(null);
        };
    }, [introEditor]);

    useEffect(() => {
        return () => {
            if (bulletinEditor == null) return;
            bulletinEditor.destroy();
            setBulletinEditor(null);
        };
    }, [bulletinEditor]);

    useEffect(() => {
        getClassDetail();
        getSourceList();
    }, []); // eslint-disable-line

    return (
        <Container>
            <Link to="/teach/classlist" className="btn btn-light my-3">
                Go Back
            </Link>
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <h2> Edit Class </h2>
                    {/* {loading && <Loader />} */}
                    {errorUpdate && (
                        <Message variant="danger">{errorUpdate}</Message>
                    )}
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="language">
                            <Form.Label>Language</Form.Label>
                            <Form.Control
                                as="select"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option>{language}</option>
                                <option value="en">en</option>
                                <option value="zh">zh</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="Start Date: ">
                            <Form.Label>Start Date:</Form.Label>
                            <DatePicker
                                selected={startDateObj}
                                onChange={(date) => {
                                    setStartDate(date);
                                }}
                                name="Start Date: "
                                timeIntervals={20}
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy "
                                className="form-control"
                            />
                        </Form.Group>

                        <Form.Group controlId="End Date: ">
                            <Form.Label>End Date:</Form.Label>
                            <DatePicker
                                selected={endDateObj}
                                onChange={(date) => {
                                    setEndDate(date);
                                }}
                                name="End Date: "
                                timeIntervals={20}
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy "
                                className="form-control"
                            />
                        </Form.Group>
                        <Form.Group controlId="Register Link">
                            <Form.Label>Register Link</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Register Link"
                                value={registerLink}
                                onChange={(e) =>
                                    setRegisterLink(e.target.value)
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="includeLibrary">
                            <Form.Label>Include Library</Form.Label>
                            <Form.Check
                                type="switch"
                                checked={includeLibrary}
                                onChange={(e) =>
                                    setIncludeLibrary(e.target.checked)
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="source">
                            <Form.Label>Source</Form.Label>
                            <div
                                className="form-library-control"
                                onClick={openSourceModal}
                            >
                                {sources.map((item, index) => (
                                    <div key={index}>{item.name}</div>
                                ))}
                            </div>
                        </Form.Group>
                        <Form.Group controlId="introduction">
                            <Form.Label>Introduction</Form.Label>
                            <div
                                style={{
                                    border: "1px solid #ccc",
                                    zIndex: 100,
                                }}
                            >
                                <Toolbar
                                    editor={introEditor}
                                    defaultConfig={toolbarConfig}
                                    mode="default"
                                    style={{ borderBottom: "1px solid #ccc" }}
                                />
                                <Editor
                                    defaultConfig={editorConfig}
                                    value={introduction}
                                    onCreated={setIntroEditor}
                                    onChange={(editor) =>
                                        setIntroduction(editor.getHtml())
                                    }
                                    mode="default"
                                    style={{
                                        height: "500px",
                                        overflowY: "hidden",
                                    }}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <div
                                style={{
                                    border: "1px solid #ccc",
                                    zIndex: 100,
                                }}
                            >
                                <Toolbar
                                    editor={editor}
                                    defaultConfig={toolbarConfig}
                                    mode="default"
                                    style={{ borderBottom: "1px solid #ccc" }}
                                />
                                <Editor
                                    defaultConfig={editorConfig}
                                    value={description}
                                    onCreated={setEditor}
                                    onChange={(editor) =>
                                        setDescription(editor.getHtml())
                                    }
                                    mode="default"
                                    style={{
                                        height: "500px",
                                        overflowY: "hidden",
                                    }}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group controlId="bulletin">
                            <Form.Label>Bulletin</Form.Label>
                            <div
                                style={{
                                    border: "1px solid #ccc",
                                    zIndex: 100,
                                }}
                            >
                                <Toolbar
                                    editor={bulletinEditor}
                                    defaultConfig={toolbarConfig}
                                    mode="default"
                                    style={{ borderBottom: "1px solid #ccc" }}
                                />
                                <Editor
                                    defaultConfig={editorConfig}
                                    value={bulletin}
                                    onCreated={setBulletinEditor}
                                    onChange={(editor) =>
                                        setBulletin(editor.getHtml())
                                    }
                                    mode="default"
                                    style={{
                                        height: "500px",
                                        overflowY: "hidden",
                                    }}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group controlId="paymentInfo">
                            <Form.Label>Payment Information</Form.Label>
                            <div
                                style={{
                                    border: "1px solid #ccc",
                                    zIndex: 100,
                                }}
                            >
                                <Toolbar
                                    editor={paymentInfoEditor}
                                    defaultConfig={toolbarConfig}
                                    mode="default"
                                    style={{ borderBottom: "1px solid #ccc" }}
                                />
                                <Editor
                                    defaultConfig={editorConfig}
                                    value={paymentInfo}
                                    onCreated={setPaymentInfoEditor}
                                    onChange={(editor) =>
                                        setPaymentInfo(editor.getHtml())
                                    }
                                    mode="default"
                                    style={{
                                        height: "500px",
                                        overflowY: "hidden",
                                    }}
                                />
                            </div>
                        </Form.Group>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loadingUpdate}
                        >
                            {loadingUpdate ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Update"
                            )}
                        </Button>
                    </Form>
                </Col>
            </Row>
            <Modal show={sourceVisible} onHide={closeSourceModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Source</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="align-items-center">
                        <Col lg={8}>
                            <Form.Group
                                controlId="search"
                                style={{ display: "flex" }}
                            >
                                <Form.Control
                                    className="mr-sm-3 ml-sm-6"
                                    type="text"
                                    name="keyword"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="Search By NAME"
                                />
                                <Button
                                    size="sm"
                                    onClick={searchSource}
                                    variant="outline-success"
                                >
                                    Search
                                </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="mb-2">
                        Selected: {selectedSource.map((s) => s.name).join("、")}
                    </div>
                    <Table
                        striped
                        bordered
                        hover
                        responsive
                        className="source-table"
                    >
                        <thead>
                            <tr>
                                <th width={80}></th>
                                <th>name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sourceList.map((item, index) => (
                                <tr key={item._id}>
                                    <td>
                                        <Checkbox
                                            checked={selectedSource
                                                .map((s) => s.id)
                                                .includes(item._id)}
                                            onClick={() => selecteSource(item)}
                                        />
                                    </td>
                                    <td>{item.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination
                        count={Math.ceil(total / pageSize)}
                        page={page}
                        onChange={changePage}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeSourceModal}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={selectSource}
                        disabled={selectedSource.length === 0}
                    >
                        Select
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default TeachClassEditView;
