import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import pyclass from "../pyclass";

const enButtun = (id) => {
  if (id.e_id === "1") {
    let product = pyclass.find((p) => p._id === "1");
    return (
      <LinkContainer to={`/class/${product._id}/en`}>
        <Button variant="info" className="my-3 p-3 rounded">
          English
        </Button>
      </LinkContainer>
    );
  } else {
    return <div></div>;
  }
};

export default enButtun;
