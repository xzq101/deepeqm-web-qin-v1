import React from "react";
import pyclass from "../pyclass";
import EnLBut from "./enButtun";
import { Container, Row, Col, Card } from "react-bootstrap";
import classTwo2 from "../img/class2021summer2.png";
import classME2022S from "../img/2022-S-ME-class.png";
import classME2022F from "../img/22-23-calinder.png";

import classME2023Summer from "../img/2023-physics-summer-s.png";
import classME2023Fall from "../img/2023-2024-calinder-2.png";

const class_1 = (id) => {
    console.log("id in class_1.js", id);
    if (id.C_id === "122") {
        let product = pyclass.find((p) => p._id === "122");

        return (
            <Container>
                <Row>
                    <Col sm={12}>
                        <Card className="my-3 p-3 rounded">
                            <Card.Title>
                                本课程需要的基础 (Prerequisites)
                            </Card.Title>
                            <Card.Body>
                                力学是物理的基础课，因此无需物理基础。数学方面需要有代数基础，能用字母求解二元一次方程，多元一次方程组，以及分析图表。无需三角函数基础。(This
                                class is designed for students in Grade 8 to
                                Grade 12. For students in Grade 8, need to learn
                                algebra before this class.)
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
                                There are 21 lectures in summer 2023, as shown
                                in Bule in the picture below . Every lecture
                                takes 2 hours. The summer section also includes
                                three exercise sections.
                                <ul>
                                    <li>
                                        6/11-6/25: Every Satuday Night 7:00 PM
                                        to 9:00 PM (EST)
                                    </li>
                                    <li>
                                        6/27-7/1: Monday, Wednesday and Friday
                                        Night 7:00 PM to 9:00 PM (EST)
                                    </li>
                                    <li>
                                        7/11-7/15: Monday, Wednesday and Friday
                                        Night 7:00 PM to 9:00 PM (EST)
                                    </li>
                                    <li>
                                        7/18-8/5: Exercise section: Every
                                        Satuday Night 7:30 PM to 9:00 PM (EST)
                                    </li>
                                    <li>
                                        8/8-9/2: Monday, Wednesday and Friday
                                        Night 7:00 PM to 9:00 PM (EST)
                                    </li>
                                </ul>
                                <Row>
                                    <Col sm={16}>
                                        <Card className="my-3 p-3 rounded">
                                            <Card.Img
                                                variant="top"
                                                src={classME2023Summer}
                                            />
                                        </Card>
                                    </Col>
                                </Row>
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
                                        Class 1: (6/11) Introduction to Physics,
                                        Units, Vectors and Trigonometry
                                    </li>
                                    <li>Class 2: (6/18) Kinematic 1D A </li>
                                    <li>Class 3: (6/25) Kinematic 1D B </li>
                                    <li>Class 4: (6/27) Newton's Laws</li>
                                    <li>Class 5: (6/29) Free body diagram</li>
                                    <li>Class 6: (7/1) Tension</li>
                                    <li>Class 7: (7/11) Hooke's law</li>
                                    <li>Class 8: (7/13) Friction</li>
                                    <li>Class 9: (7/15) Friction - 2</li>
                                    <li>Exercise 1: (7/23) Kinematic</li>
                                    <li>
                                        Exercise 2: (7/30) Free body diagram
                                    </li>
                                    <li>
                                        Class 10: (8/8) Solve Dynamic problems
                                    </li>
                                    <li>Class 11: (8/10) 2D motion</li>

                                    <li>
                                        Class 12: (8/12) Circular motion and
                                        centripital force
                                    </li>
                                    <li>Class 13: (8/15) Momentum</li>
                                    <li>Class 14: (8/17) Work and Energy</li>

                                    <li>
                                        Class 15: (8/19) Energy conservation
                                    </li>
                                    <li>
                                        Class 16: (8/22) Torque and rotation
                                    </li>
                                    <li>Class 17: (8/24) Angular Momentum</li>
                                    <li>Class 18: (8/26) Rigid body motion</li>
                                    <li>
                                        Class 19: (8/29) Simple Harmonic motion
                                    </li>
                                    <li>
                                        Class 20: (8/31) Pendulum and spring
                                        mass system
                                    </li>
                                    <li>
                                        Class 21: (9/2) Problem Solving strategy
                                    </li>
                                </ul>
                            </dd>
                            <dt>课程教材 (Text Book)</dt>
                            <dd>
                                <ul>
                                    <li>
                                        Book 1:
                                        <a
                                            href="https://www.amazon.com/AP-Physics-Essentials-APlusPhysics-Guide/dp/0990724301"
                                            target="_blank"
                                        >
                                            AP Physics 1 Essentials: An
                                            APlusPhysics Guide
                                        </a>
                                        , by Halliday, Resnick, and Krane
                                    </li>
                                    <li>
                                        Book 2 (High school text book):
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
                                        Book 3 (USAPHO assigned book):
                                        <a
                                            href="https://www.amazon.com/Physics-1-Robert-Resnick/dp/0471320579"
                                            target="_blank"
                                        >
                                            Physics
                                        </a>
                                        , by Halliday, Resnick, and Krane
                                    </li>
                                    <li>
                                        每次课会有讲义可供学生复习。每次课程都会有录像上传到Youtube的私有频道，学生可以用自己的Google帐号登录查看。(Handouts
                                        and class recordings are available for
                                        every lesson.)
                                    </li>
                                </ul>
                            </dd>
                            <dt>上课方式 </dt>
                            <dd>
                                In person 和网课同时进行。
                                <ul>
                                    <li>
                                        上课用Google meet.
                                        学生要求开摄像头，老师会轮流提问，尽量保证学生在积极参与课程内容。鼓励学生上课积极发言，提问。
                                    </li>

                                    <li>
                                        网课的讲义和作业会布置在Google
                                        Classroom里。由于自学教科书入门难度较大，鼓励学生上课结束以后可以阅读教科书，加强理解。
                                    </li>

                                    <li>
                                        每次上课会有录像，供学生回放。录像会放在Youtube的私有频道，只有本节课的学生可以访问。
                                    </li>
                                    <li>每个班级满6人开始开班。</li>
                                    <li>
                                        在学期中，会安排和每个家长以及学生面谈半小时，以沟通学生的学习情况。
                                    </li>
                                </ul>
                            </dd>
                            <dd>
                                <dt>How do online classes work?</dt>
                                <ul>
                                    <li>
                                        After enrolling, the student will be
                                        invited to a google classroom. Class
                                        notes, homework, and homework solutions
                                        for each class will be posted in the
                                        google classroom.
                                    </li>
                                    <li>
                                        Google meet is used for online teaching.
                                    </li>
                                    <li>
                                        Record class videos will be posted to a
                                        private youtube channel. A sample class
                                        can be found
                                        <a
                                            href="https://youtu.be/E-eApGRawUc"
                                            target="_blank"
                                        >
                                            here
                                        </a>
                                        .
                                    </li>
                                    <li>
                                        Record homework solution videos will be
                                        posted to youtube to help students solve
                                        challenge problems.
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
                            <dt>Tuition</dt>
                            <dd>
                                <ul>
                                    <li>
                                        Tuition for Summer Class is $1500.
                                        Tuition should be paid before the class
                                        starts.
                                    </li>
                                    <li>
                                        Each student can attend 3 lessons to
                                        decide if he/she wants to continue the
                                        study. If a student quit in the first
                                        three lessons, a full refund will be
                                        issued.
                                    </li>
                                    <li>
                                        When a student withdraws the class after
                                        3 lessons, a pro-rated refund will be
                                        given.
                                    </li>
                                    <li>
                                        All students can re-take the same class
                                        in the future for free.
                                    </li>
                                </ul>
                            </dd>
                            <dt>报名方法</dt>
                            请填写以下
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSdxY50_ngqR77tdw1ikdFYSLL_t9_XlMqc5lW2xxOPmcYKkkQ/viewform?usp=sf_link"
                                target="_blank"
                            >
                                Google Form
                            </a>
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
                                University, and his Ph.D. in computation
                                mechanics. He brings his experience from
                                academia and industry to help students
                                understand the fundamental physics principle and
                                apply them to the real world problems.
                            </p>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    } else if (id.C_id === "2") {
        let product = pyclass.find((p) => p._id === "2");
        console.log(product.name);
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
                                    该课程有一定难度，适合上过Mechanics课程的学生，或者AP
                                    physics 1 4分以上的学生。
                                </Container>
                                <Container>
                                    This is an advanced-level class. Students
                                    are required to learn Mechanics before.
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
                                    2022年9月10日-2023年2月11日,每周六晚上7:00-9:00。每次课课后作业时间在1到2个小时左右。如下图蓝色框所示。
                                </Container>
                                <Container>
                                    Every Satuday night 7:00 PM to 9:00 PM, From
                                    September 2022 to February 2023. The
                                    homework time after each class is about 1 -
                                    2 hour. As shown in blue in the figure
                                    below.
                                </Container>
                                <Card.Img variant="top" src={classME2022F} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Card className="my-3 p-3 rounded">
                            <dt>课程安排 (会根据班级情况稍作调整)</dt>
                            <dd>
                                <li>Class 1: (9/10) Reference Frame</li>
                                <li>Class 2: (9/17) Reference Frame </li>
                                <li>
                                    Class 3: (9/24) Kepler’s laws & planetary
                                    motion
                                </li>
                                <li>
                                    Class 4: (10/1) Kepler’s laws & planetary
                                    motion
                                </li>
                                <li>
                                    Exercise 1-4: (10/8, 15, 22, 29) Reference
                                    Frame, Kepler’s laws & planetary motion
                                </li>
                                <li>
                                    Class 5: (11/5) Angular momentum
                                    conservation
                                </li>
                                <li>Class 6: (11/12) Rolling</li>
                                <li>
                                    Class 7: (11/19) Momentum & Energy
                                    conservation
                                </li>
                                <li>Class 8: (12/3) Oscillations</li>
                                <li>Class 9: (12/10) Oscillations</li>
                                <li>Class 10: (12/17) Fluid mechanics</li>
                                <li>Exercise 5-10: (1/7,14,21,28, 2/4,2/11)</li>
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
                                </ul>
                            </dd>
                            <dt>开课时间</dt>
                            <ul>
                                <li>2022年秋季</li>
                            </ul>
                            <dt>学费</dt>
                            <dd>
                                <ul>
                                    <li>
                                        Tuition for all 20 lessons is $1600.
                                        Tuition should be paid before the class
                                        starts.
                                    </li>
                                    <li>
                                        Return students from ME class get $150
                                        off discount per class. Tuition for all
                                        20 lessons in fall 2021 for return
                                        students is $1450.
                                    </li>
                                    <li>
                                        Previous students can take the 10
                                        exercise classes for $400.
                                    </li>
                                    <li>No Refund after registration！</li>
                                </ul>
                            </dd>
                            <dt>报名方法</dt>
                            请填写以下
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSdApL81rkRz-TVLweDJ4NfGb-IUmM7K3EP8PSvJOcAkkA83kQ/viewform?usp=sf_link"
                                target="_blank"
                            >
                                Google Form
                            </a>
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
    } else if (id.C_id === "11") {
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
                            请填写以下
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSd1kT0oK-Xs0Wyi06ro6E_ZWFmbEoZH_PLwPu3JIlBjOLBQXg/viewform?usp=sf_link"
                                target="_blank"
                            >
                                Google Form
                            </a>
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
    } else if (id.C_id === "322") {
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
                                    This Camp is for students in preparing AP
                                    physics 1 and AP physics C (Mechanics).
                                    exam.
                                </Container>
                                <Container>
                                    这个训练营是为参加5月AP物理1和AP物理C（力学）考试的学生准备的。
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
                                    <ul>
                                        <li>
                                            4/17/2023 -4/23/2023, 7:00 PM to
                                            9:00 PM EST every day。
                                        </li>
                                    </ul>
                                </Container>
                                <Container></Container>
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
                                        We will work on previous exam in the
                                        morning and review the solutions in the
                                        afternoon.
                                    </li>
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
                            <dt>课程如何进行？</dt>
                            <dd>
                                In person 和网课同时进行。
                                <ul>
                                    <li>
                                        上课用zoom
                                        meeting.学生要求开摄像头，老师会轮流提问，尽量保证学生在积极参与课程内容。鼓励学生上课积极发言，提问。
                                    </li>
                                </ul>
                            </dd>
                            <dt>学费</dt>
                            <dd>
                                <ul>
                                    <li>
                                        学费为每天课程$200元。学费在上课前支付。可以接受zelle转账，paypal或者邮寄支票。
                                    </li>
                                </ul>
                            </dd>

                            <dt>午餐</dt>
                            <dd>
                                <ul>
                                    <li>
                                        参加 in person
                                        的学生可以自带午餐，或者在附件点餐。
                                    </li>
                                </ul>
                            </dd>

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
                                University, and his Ph.D. in computation
                                mechanics. He brings his experience from
                                academia and industry to help students
                                understand the fundamental physics principle and
                                apply them to the real world problems.
                            </p>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    } else if (id.C_id === "522") {
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
                                    4 or above in AP Physics exam.
                                </Container>
                                <Container>
                                    F=MA习题课是针对AP物理5分以上和上过竞赛部分力学课的同学开始的练习课程。可以帮助学生巩固和提高求解复杂的动力学问题的能力。
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
                                    <ul>
                                        <li>
                                            6/12/2022 -8/28/2022, Every Sunday
                                            night 7:00 PM to 9:00 PM EST (no
                                            class July 3). 11 Classes in summer.
                                        </li>
                                    </ul>
                                </Container>
                                <Container></Container>
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
                                    <li>Class 1: June 12</li>
                                    <li>Class 2: June 19</li>
                                    <li>Class 3: June 26</li>
                                    <li>Class 4: July 10</li>
                                    <li>Class 5: July 17</li>
                                    <li>Class 6: July 24</li>
                                    <li>Class 7: July 31</li>
                                    <li>Class 8: August 7</li>
                                    <li>Class 9 : August 14</li>
                                    <li>Class 10: August 21</li>
                                    <li>Class 11: August 28</li>
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
                            <dt>课程如何进行？</dt>
                            <dd>
                                In person 和网课同时进行。
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
                                        学费为每天课程$60元，报满11次的课程$600。学费在上课前支付。可以接受zelle转账，paypal或者邮寄支票。
                                    </li>
                                    <li>以前上过我的物理课的学生10%off。</li>
                                </ul>
                            </dd>

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
                                University, and his Ph.D. in computation
                                mechanics. He brings his experience from
                                academia and industry to help students
                                understand the fundamental physics principle and
                                apply them to the real world problems.
                            </p>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    } else if (id.C_id === "622") {
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
                                    For students who are taking a Mechanics
                                    class in summer, or have officially studied
                                    Mechanics before.
                                </Container>
                                <Container>
                                    正在上暑假的力学课，或者以前系统地学习过力学知识。
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
                                    <ul>
                                        <li>
                                            7/9/2022 -9/3/2022, Every Satuday
                                            night 7:00 PM to 9:00 PM EST. 9
                                            Classes in total.
                                        </li>
                                    </ul>
                                </Container>
                                <Container></Container>
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
                                    <li>Class 1: July 9</li>
                                    <li>Class 2: June 16</li>
                                    <li>Class 3: June 23</li>
                                    <li>Class 4: July 30</li>
                                    <li>Class 5: August 6</li>
                                    <li>Class 6: August 13</li>
                                    <li>Class 7: August 20</li>
                                    <li>Class 8: August 27</li>
                                    <li>Class 9 : September 3</li>
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
                            <dt>课程如何进行？</dt>
                            <dd>
                                In person 和网课同时进行。
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
                                        学费为每天课程$60元，报满9次的课程$500。学费在上课前支付。可以接受zelle转账，paypal或者邮寄支票。
                                    </li>
                                    <li>
                                        因为有两次课和暑假AP力学课重叠。对于同时报暑假AP力学课和这个习题课的同学，习题课部分学费为$300。
                                    </li>
                                    <li>以前上过我的物理课的学生10%off。</li>
                                </ul>
                            </dd>

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
                                University, and his Ph.D. in computation
                                mechanics. He brings his experience from
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
        return <div> </div>;
    }
};

export default class_1;
