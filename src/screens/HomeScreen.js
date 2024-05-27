import React, { useState, useEffect } from "react";

import ProductList from "../components/ProductList";
import { Row, Col, Table, ListGroup, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

import ProductCarousel from "../components/ProductCarousel";

import pyclasses from "../pyclass";

import "./HomeScreen.css";
import classME2022All from "../img/2022-S-ME-class-all.png";
import classME2022Fall from "../img/22-23-calinder.png";

import classME2023Summer from "../img/2023-physics-summer-s.png";
import classME2023Fall from "../img/2023-2024-calinder-3.png";
import axios from '../utils/axios';

const HomeScreen = () => {

    const [classes, setClasses] = useState([]);
    const [introduction, setIntroduction] = useState('');

    const getClasses = () => {
        axios.get('/public/getHomeClasses', { params: { language: window.localStorage.getItem('lang') || 'en' } })
            .then(res => {
                setClasses(res.result.list)
            });
    }

    const getHomeDetail = () => {
        axios.get('/public/getHomeDetail').then(res => {
            setIntroduction(res.result.introduction);
        });
    }

    useEffect(() => {
        getClasses();
        getHomeDetail();
    }, []);



    
    // const c113 = 322;
    // const c110 = 122;
    // const c111 = 622;
    // const c210 = 2;
    // const c120 = 822;
    // const c112 = 922;
    // const c211 = 522;
    // const c212 = 722;
    return (
        <div>
            {/* <h1 className="my-5 class-col" id="t_pyclass">
                Physics
            </h1>

            <h2 className="my-5 class-col" id="t_pyclass">
                Physics Courses
            </h2>

            <Table striped bordered hover responsive>
                <tbody>
                    <tr>
                        <td>2023 Spring</td>
                        <td>
                            <Link to={`/class/${c113}`}>
                                <Button variant="Light" className=" rounded">
                                    PH113 -AP PHYSICS 1 & C (MECHANICS) EXAM
                                    PREPARATION CAMP （AP力学强化训练营) (Apr.
                                    17-23)
                                </Button>
                            </Link>
                        </td>
                    </tr>
                    <tr>
                        <td>2023 Summer</td>
                        <td>
                            <ListGroup>
                                <ListGroup.Item>
                                    <Link to={`/class/${c110}`}>
                                        <Button
                                            variant="info"
                                            className=" rounded"
                                        >
                                            PH110 - AP PHYSICS: MECHANICS
                                            (AP力学理论课）
                                        </Button>
                                    </Link>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Link to={`/class/${c111}`}>
                                        <Button
                                            variant="success"
                                            className=" rounded"
                                        >
                                            PH111 - AP MECHANICS PRACTICE
                                            (AP力学习题课)
                                        </Button>
                                    </Link>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Link to={`/class/${c210}`}>
                                        <Button
                                            variant="danger"
                                            className=" rounded"
                                        >
                                            PH210 - ADVANCED MECHANICS THEORY
                                            FOR F=MA EXAM (F=MA 理论课)
                                        </Button>
                                    </Link>
                                </ListGroup.Item>
                            </ListGroup>
                            <img src={classME2023Summer} />
                        </td>
                    </tr>
                    <tr>
                        <td>2023 Full - 2024 Spring</td>

                        <td>
                            <ListGroup>
                                <ListGroup.Item>
                                    <Link to={`/class/${c120}`}>
                                        <Button
                                            variant="primary"
                                            className=" rounded"
                                        >
                                            PH120 - Fluid Mechanics & EM THEORY
                                            (流体力学和电磁学理论课) - Fall
                                        </Button>
                                    </Link>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Link to={`/class/${c112}`}>
                                        <Button
                                            variant="success"
                                            className=" rounded"
                                        >
                                            PH112 -AP MECHANICS （1&C） PRACTICE
                                            (AP力学（适合1和C）习题课) - Spring
                                        </Button>
                                    </Link>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Link to={`/class/${c211}`}>
                                        <Button
                                            variant="info"
                                            className=" rounded"
                                        >
                                            PH211 -F=MA PRACTICE
                                            (F=MA比赛习题课)
                                        </Button>
                                    </Link>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Link to={`/class/${c212}`}>
                                        <Button
                                            variant="danger"
                                            className=" rounded"
                                        >
                                            PH212 -F=MA winter camp
                                            (F=ma比赛寒假训练营)
                                        </Button>
                                    </Link>
                                </ListGroup.Item>
                            </ListGroup>
                            <img src={classME2023Fall} />
                        </td>
                    </tr>
                </tbody>
            </Table>

            <h1 className="my-5 class-col" id="t_pyclass">
                Physics Courses description
            </h1>
            <h2 className="my-5 class-col" id="t_pyclass">
                Physics Theory Courses
            </h2>
            <Row>
                {pyclasses
                    .filter((inClass) => inClass.category === "PhysicsTheory")
                    .map((pyclass, key) => (
                        <Col sm={12} md={6} lg={6}>
                            <ProductList product={pyclass} />
                        </Col>
                    ))}
            </Row>
            <h2 className="my-5 class-col" id="t_pyclass">
                Physics Exercise Courses
            </h2>
            <Row>
                {pyclasses
                    .filter((inClass) => inClass.category === "PhysicsEx")
                    .map((pyclass, key) => (
                        <Col sm={12} md={6} lg={6}>
                            <ProductList product={pyclass} />
                        </Col>
                    ))}
            </Row>
            <h1 className="my-5 class-col " id="t_mathclass">
                Math Courses
            </h1>
            <Row>
                {pyclasses
                    .filter((inClass) => inClass.category === "Math")
                    .map((mathclass, key) => (
                        <Col sm={12} md={6} lg={6}>
                            <ProductList product={mathclass} />
                        </Col>
                    ))}
            </Row> */}
            <div className="rich-text" dangerouslySetInnerHTML={{ __html: introduction }}>

            </div>
            {
                classes.map((item, index) => (
                    <div key={index}>
                        <h2 className="my-5 class-col" id={item.category}>
                            {item.category}
                        </h2>
                        <Row>
                            {item.classes.map((cl) => (
                                    <Col sm={12} md={12} lg={12} key={cl._id}>
                                        <ProductList product={cl} />
                                    </Col>
                                ))}
                        </Row>
                    </div>
                ))
            }
        </div>
    );
};

export default HomeScreen;
