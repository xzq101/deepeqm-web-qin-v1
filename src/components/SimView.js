import React from "react";
import Matter from "matter-js";

class SimView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        var Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Mouse = Matter.Mouse,
            Composite = Matter.Composite,
            MouseConstraint = Matter.MouseConstraint;

        var engine = Engine.create({
            // positionIterations: 20
        });

        var render = Render.create({
            element: this.refs.scene,
            engine: engine,
            options: {
                width: 800,
                height: 400,
                wireframes: false,
            },
        });

        var topWall = Bodies.rectangle(400, 50, 720, 20, { isStatic: true });
        var leftWall = Bodies.rectangle(50, 210, 20, 300, { isStatic: true });
        var rightWall = Bodies.rectangle(750, 210, 20, 300, { isStatic: true });
        var bottomWall = Bodies.rectangle(400, 350, 720, 20, {
            isStatic: true,
        });

        var ball = Bodies.circle(90, 280, 20);

        World.add(engine.world, [
            topWall,
            leftWall,
            rightWall,
            bottomWall,
            ball,
        ]);

        // add mouse control
        var mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false,
                    },
                },
            });

        World.add(engine.world, mouseConstraint);

        Matter.Events.on(mouseConstraint, "mousedown", function (event) {
            World.add(
                engine.world,
                Bodies.circle(150, 50, 30, { restitution: 0.7 })
            );
        });

        Engine.run(engine);

        Render.run(render);
    }

    render() {
        return <div ref="scene" />;
    }
}
export default SimView;

// //const SimView = () => {
//     return (
//         <Container>
//             <div>In Sim View</div>
//         </Container>
//     );
// };

//export default SimView;
