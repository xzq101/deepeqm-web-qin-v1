import React from "react";
import { Card, Button } from "react-bootstrap";

import { Link } from "react-router-dom";
const ProductList = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/class/${product._id}`}>
        <Card.Header as="h3">
          <strong>{product.name}</strong>
        </Card.Header>
      </Link>

      <Card.Body>
        {/* <Card.Text>{product.grade}</Card.Text> */}
        {/* <Card.Text as="div">{product.introduction}</Card.Text> */}
        <Card.Text as="div" className="rich-text" dangerouslySetInnerHTML={{ __html: product.introduction }}></Card.Text>
        <Link to={`/class/${product._id}`}>
          <Button variant="info" className="my-3 p-3 rounded">
            Learn More
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ProductList;
