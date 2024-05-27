import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const Canvas = ({ draw, height, width }) => {
    const canvas = useRef(null);

    useEffect(() => {
        const context = canvas.current.getContext("2d");
        draw(context);
        loadImg(context);
    });
    const loadImg = (context) => {
        console.log("context", context);
        //const context = canvas.current.getContext("2d");
        var img = new Image();
        console.log(img);
        img.src = "/uploads/1ppd.png";
        img.onload = () => {
            console.log("img size", img.width);

            context.drawImage(img, 0, 0);
        };
    };
    console.log("window size", height, window.innerHeight);
    return <canvas ref={canvas} />;
};

export default Canvas;
