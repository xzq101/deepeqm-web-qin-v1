import React from "react";
import pyclass from "../pyclass";
import { Container, Row, Col, Card } from "react-bootstrap";

import classTwo2 from "../img/class2021summer2.png";
import classTwo3 from "../img/class-3-2021-summer.png";

const class_11 = (id) => {
    if (id.C_id === "11") {
        let product = pyclass.find((p) => p._id === "11");

        return (
            <Container>
                <Row>
                    <Col sm={12}>
                        <Card className="my-3 p-3 rounded">
                            <Card.Title>
                                本课程需要的基础 (Prerequisites)
                            </Card.Title>
                            <Card.Body>
                                <Container>
                                    {" "}
                                    力学是物理的基础课，因此无需物理基础。数学方面需要有代数基础，能用字母求解二元一次方程，多元一次方程组，以及分析图表。无需三角函数基础。
                                </Container>
                                <Container>
                                    This class is designed for students in Grade
                                    8 to Grade 12. For students in Grade 8, need
                                    to learn algebra before this class.
                                </Container>
                            </Card.Body>
                            <Card.Title>
                                授课语言 (Language of instruction)
                            </Card.Title>
                            <Card.Body>英语 (English)</Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Card className="my-3 p-3 rounded">
                            <Card.Title>上课时间 (Class Meet Time)</Card.Title>
                            <Card.Body>
                                <Container>
                                    2021年9月9日-2022年5月5日,每周四晚上7：30-9：00。正好在AP考试前上完全部内容。每次课课后作业时间在1个小时左右。
                                </Container>
                                <Container>
                                    Every Thursday night 7:30 PM to 9 PM, From
                                    September 2021 to April 2022, all content
                                    will be completed just before the AP exam.
                                    The homework time after each class is about
                                    1 hour.
                                </Container>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {/*   new card   */}
                <Row>
                    <Col sm={12}>
                        <Card className="my-3 p-3 rounded">
                            <dt>课程内容安排 (Class Schedule)</dt>
                            <dd>
                                <ul>
                                    <li>
                                        Class 1: (9/9) Introduction to Physics,
                                        Units and Vectors
                                    </li>
                                    <li>Class 2: (9/16) Kinematic 1D A </li>
                                    <li>Class 3: (9/23) Kinematic 1D B </li>
                                    <li>
                                        Class 4: (9/30) Kinematic: uniform
                                        acceleration motion
                                    </li>
                                    <li>
                                        Class 5: (10/7) Homework Review,
                                        Trigonometry
                                    </li>
                                    <li>Class 6: (10/14) Newton's Laws</li>
                                    <li>Class 7: (10/21) Free Body diagram</li>
                                    <li>
                                        Class 8: (10/28) Four type of Forces
                                    </li>
                                    <li>
                                        Class 9: (11/4) Solve Dynamic problems
                                    </li>
                                    <li>Class 10: (11/11) Hooke's Law</li>
                                    <li>Class 11: (11/18) Friction - a</li>
                                    <li>No Class: Thanksgiving holiday</li>
                                    <li>Class 12: (12/2) Friction - b</li>
                                    <li>Class 13: (12/9) Friction - c</li>
                                    <li>Class 14: (12/16) 2D motion</li>
                                    <li>December Recess: (12/23) </li>
                                    <li>December Recess: (12/30) </li>
                                    <li>Class 15: (1/6) Circular motion</li>
                                    <li>
                                        Class 16: (1/13) Circular motion and
                                        Banked Curve
                                    </li>
                                    <li>
                                        Class 17: (1/20) Gravitational force
                                    </li>
                                    <li>Class 18: (1/27) Momentum</li>
                                    <li>Class 19: (2/3) Work and Energy</li>
                                    <li>
                                        Class 20: (2/10) Energy Conservation
                                    </li>
                                    <li>Class 21: (2/17) Dispersive Force</li>
                                    <li>Winter break: (2/24) </li>
                                    <li>Class 22: (3/3) HW review </li>
                                    <li>
                                        Class 23: (3/10) Purely Elastic
                                        Collision{" "}
                                    </li>
                                    <li>
                                        Class 24: (3/17) Torque and Rotation
                                    </li>
                                    <li>
                                        Class 25: (3/24) Static balance with
                                        Torque
                                    </li>
                                    <li>Class 26: (3/31) Angular momentum</li>
                                    <li>
                                        Class 27: (4/7) Simple Harmonic motion
                                    </li>
                                    <li>Class 28: (4/14) Pendulum </li>
                                    <li>Spring recess: (4/21) </li>
                                    <li>
                                        Class 29: (4/28) Problem Solving
                                        strategy
                                    </li>
                                    <li>Class 30: (5/5) Class review</li>
                                </ul>
                            </dd>
                            <dt>课程教材</dt>
                            <dd>
                                <ul>
                                    <li>
                                        Book 1 (High school text book):
                                        <a
                                            href="https://salmanisaleh.files.wordpress.com/2019/02/fundamentals-of-physics-textbook.pdf"
                                            target="_blank"
                                        >
                                            Fundamentals of Physics
                                        </a>
                                        , 10th Edition, by David Halliday,
                                        Robert Resnick, Jearl Walker
                                    </li>
                                    <li>
                                        Book 2 (USAPHO assigned book):
                                        <a
                                            href="https://www.amazon.com/Physics-1-Robert-Resnick/dp/0471320579"
                                            target="_blank"
                                        >
                                            Physics
                                        </a>
                                        , by Halliday, Resnick, and Krane
                                    </li>
                                    <li>
                                        每次课会有讲义可供学生复习。每次课程都会有录像上传到Youtube的私有频道，学生可以用自己的Google帐号登录查看。
                                    </li>
                                </ul>
                            </dd>
                            <dt>网课如何进行？</dt>
                            <dd>
                                <ul>
                                    <li>
                                        上课用zoom
                                        meeting.学生要求开摄像头，老师会轮流提问，尽量保证学生在积极参与课程内容。鼓励学生上课积极发言，提问。
                                    </li>

                                    <li>
                                        网课的讲义和作业会布置在Google
                                        Classroom里。由于自学教科书入门难度较大，鼓励学生上课结束以后可以阅读教科书，加强理解。
                                    </li>

                                    <li>
                                        每次上课会有录像，供学生回放。录像会放在Youtube的私有频道，只有本节课的学生可以访问。
                                    </li>
                                    <li>
                                        每个班级满6人开始开班，班级人数限制在15人。班级人数最多不超过20人。人数在15-20人之间，会增加一次额外答疑时间。
                                    </li>
                                    <li>
                                        及时和家长以及学生交流，以沟通学生的学习情况。
                                    </li>
                                    <li>
                                        如果Covid-19 情况缓解，会恢复面授课程。
                                    </li>
                                </ul>
                            </dd>
                            <dt>学费</dt>
                            <dd>
                                <ul>
                                    <li>
                                        所有课程学费为
                                        $1500。学费在上课前支付。目前还没有比较好的在线支付方式，可以接受zelle转账，paypal或者邮寄支票。
                                    </li>
                                    <li>
                                        每个学生可以免费试听3次课，如果觉得不合适自己，可以全额退款。
                                    </li>
                                    <li>
                                        3次课以后退课，按未上课次数比例退款。
                                    </li>
                                    <li>所有学生可以免费重上同一课程。</li>
                                </ul>
                            </dd>
                            <dt>报名方法</dt>
                            Email或者微信。
                            班级报名超过15人以后，高年级学生优先。如果对上课时间有建议可以写在form最后的comments里。
                            <dt>联系方式:</dt>
                            <dd>
                                <a href="mailto: riqinxl@gmail.com">
                                    Email: riqinxl@gmail.com
                                </a>
                                <br />
                            </dd>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Card className="my-3 p-3 rounded">
                            <Card.Title>Instructor</Card.Title>

                            <p>
                                Dr. Qin was a China PHO qualifier in high
                                school. He received his Bachelor's degree from
                                the Mechanical Engineering Department at Peking
                                University, and his Ph.D. from Penn State
                                University in computation mechanics. Dr. Qin
                                then joined ABAQUS, the world top numerical
                                simulation company, and currently a Principal
                                Mechanical Engineer at an Aerospace industry. He
                                was also an adjunct professor at URI from
                                2018-2019. He brings his experience from
                                academia and industry to help students
                                understand the fundamental physics principle and
                                apply them to the real world problems.
                            </p>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    } else {
        if (id.C_id === "2") {
            let product = pyclass.find((p) => p._id === "2");
            console.log(product.name);
            return (
                <Row>
                    <Col sm={12}>
                        <Card className="my-3 p-3 rounded">
                            <Card.Title>本课程需要的基础</Card.Title>
                            <Card.Body>
                                力学是物理的基础课，因此无需物理基础。数学方面需要有代数基础，能用字母求解二元一次方程，多元一次方程组，以及分析图表。无需三角函数基础。
                            </Card.Body>
                            <Card.Title>授课语言</Card.Title>
                            <Card.Body>英语</Card.Body>
                        </Card>
                    </Col>
                </Row>
            );
        } else {
            return <div> </div>;
        }
    }
};

export default class_11;
