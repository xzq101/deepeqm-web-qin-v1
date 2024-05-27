import React, {useState, useEffect} from "react";
import dayjs from "dayjs";
import { Container, Row, Col, Button, Card, ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";
import axios from '../utils/axios'

const ClassDetailView = ({ match }) => {
    // let product = pyclass.find((p) => p._id === match.params.id);
    const [classDetail, setClassDetail] = useState({});

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const isSignedIn = !!userInfo;

    useEffect(() => {
        axios.get(`/public/getClassById?id=${match.params.id}`).then((res) => {
            setClassDetail(res.result)
            document.title = res.result.name;
        });
    }, [match.params.id]);

    return (
        <Container>
            <Container>
                <Row>
                    <Col sm={4}>
                        <Card className="my-3 p-3 rounded">
                            <ListGroup variant="flush">
                                {/* <ListGroup.Item>{product.grade}</ListGroup.Item> */}
                                <ListGroup.Item>
                                    {dayjs(classDetail.startDate).format('YYYY-MM-DD')}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    {
                                        isSignedIn ? `Price: ${classDetail.price}` : 'Sign in to check price'
                                    }
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    {
                                        isSignedIn ?
                                         (
                                            <Button
                                                href={`/classRegister/${classDetail._id}`}
                                                target={"_blank"}
                                                variant="info"
                                                className=" rounded"
                                            >
                                                Register
                                            </Button>
                                         ) : (
                                            <Button
                                                href="/register?redirect=/myclasses"
                                                target={"_blank"}
                                                variant="info"
                                                className=" rounded"
                                            >
                                                Register
                                            </Button>
                                         )
                                    }
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                    <Col sm={8}>
                        <Card className="my-3 p-3 rounded">
                            <h1 id="ch">
                                <strong>{classDetail.name}</strong>
                            </h1>
                            <Card.Body>
                                <div className="rich-text" dangerouslySetInnerHTML={{ __html: classDetail.description }}></div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {/* <Wclass1 C_id={product._id} /> */}
            </Container>
        </Container>
    );
};

export default ClassDetailView;
