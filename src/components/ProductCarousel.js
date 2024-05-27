import React from "react";
import Carousel from "react-bootstrap/Carousel";
import { LinkContainer } from "react-router-bootstrap";
import "./ProductCarousel.css";
import picOne from "../img/me-8-4-3.png";
import picTwo from "../img/1ppd.png";
import picThree from "../img/amc-mathcount.png";

const ProductCarousel = () => {
  return (
    <Carousel>
      <Carousel.Item pause={"hover"}>
        <LinkContainer to={`/class/1`}>
          <img
            className="d-block w-100 "
            src={picOne}
            alt="First slide"
          />
        </LinkContainer>
        <Carousel.Caption className="ml">
          {/* jsx <h2 className="class-time">2021 summer class registration open</h2>*/}
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <LinkContainer to={`/class/5`}>
          <img
            className="d-block w-100"
            src={picThree}
            alt="Second slide"
          />
        </LinkContainer>
        <Carousel.Caption></Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <LinkContainer to={`/class/3`}>
          <img
            className="d-block w-100"
            src={picTwo}
            alt="Third slide"
          />
        </LinkContainer>
        <Carousel.Caption></Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default ProductCarousel;
