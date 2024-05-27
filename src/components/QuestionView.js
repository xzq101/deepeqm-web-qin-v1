import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { sqrt } from "mathjs";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
const QuestionView = () => {
    return (
        <Container>
            <div>In Question View</div>
            <div>
                in line <InlineMath>\int_0^\infty x^2 dx</InlineMath> is
                {sqrt(4).toString()}
            </div>
        </Container>
    );
};

export default QuestionView;
