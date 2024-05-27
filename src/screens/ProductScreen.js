import React from "react";
import pyclass from "../pyclass";
import DesCom from "../components/DesCom";
import Wclass1 from "../components/class_1";
import Wclass11 from "../components/class_11";
import Wclass2 from "../components/class_2";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../components/Buttun.css";
import { LinkContainer } from "react-router-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import EnLBut from "../components/enButtun";

const ProductScreen = ({ match }) => {
    let product = pyclass.find((p) => p._id === match.params.id);

    return (
        <Container>
            <Container>
                <Row>
                    <Col sm={8}>
                        <Card className="my-3 p-3 rounded">
                            <h1 id="ch">
                                <strong>{product.name}</strong>
                            </h1>
                            <Card.Body>
                                {product.description.map((description) => (
                                    <DesCom description={description} />
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={4}>
                        <Card className="my-3 p-3 rounded">
                            <ListGroup variant="flush">
                                <ListGroup.Item>{product.grade}</ListGroup.Item>
                                <ListGroup.Item>
                                    {product.classBegin}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Price: ${product.price}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Button
                                        href={product.register}
                                        variant="info"
                                        className=" rounded"
                                    >
                                        Register
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
                <Wclass1 C_id={product._id} />
            </Container>
        </Container>
    );
};

export default ProductScreen;
