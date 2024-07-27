import { useSpring, animated, useTransition } from '@react-spring/web'
import { useEffect, useState, useRef } from "react"
export default function MyComponent() {

  const [toggle, setToggle] = useState(false);
  const [move, setMove] = useState(false);
  const [lastx, setLastX] = useState(100);
  const [x, setX] = useState(100);
  const [y, setY] = useState(100);
  const moveRepeatRef = useRef(true);
  const timerRef = useRef(null);
  const moveRef = useRef(move);

  const MyCircle1 = ({ style }) => {
    return (
      <animated.svg width="200" height="200" style={style}>
        <circle cx="100" cy="100" r="100" fill="blue" />
        <rect x="50" y="50" width="100" height="100" fill="green" />
      </animated.svg>
    );
  };
  const MyCircle2 = ({ style }) => {
    return (
      <animated.svg width="200" height="200" style={style}>
        <ellipse cx="100" cy="100" rx="50" ry="25" fill="red" />
        <line x1="0" y1="0" x2="200" y2="200" stroke="black" strokeWidth="2" />
      </animated.svg>
    );
  };

  const props = useSpring({
    config: { tension: 200, friction: 10 }, 
    cx: x,
    cy: y,
  });

  useEffect(() => {
    // declared at here because of the timerRef update
    function waitNextMove(text, time) {
      return new Promise(resolve => {
        console.log(text, time);
        timerRef.current = setTimeout(resolve, time)  // for instant stop
      });
    }

    // async-ly start move and repeat 
    new Promise(async (resolve) => {
      while (moveRepeatRef.current) {
        if (moveRef.current === false) {
          // console.log("move current status:", move);
          await waitNextMove("waiting move to be true", 2000);
          continue;
        }
        const moveInterval = (Math.random() * 3 + 2) * 1000; // 与上一次之间move的间隔时间
        await waitNextMove("moving", moveInterval);
        // generate next move position offset
        setX(Math.round(Math.random() * 100));
        setY(Math.round(Math.random() * 100));
      }
      resolve();
    });

    return () => {
      moveRepeatRef.current = false;
      clearTimeout(timerRef.current);
    }
  }, []);

  useEffect(() => {
    moveRef.current = move;
  }, [move]);

  // const MyRect = ({style}) => {
  //   return (
  //     <animated.div style={{...props2, ...style}}></animated.div>
  //   )
  // };

  const transitions = useTransition(toggle, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const handleClick = () => {
    setToggle(!toggle);
    console.log("Shape:", toggle);
  }
  const handleClick2 = () => {
    setMove(!move);
    // moveRef.current = !moveRef.current;
    console.log("Move set to:", !move);
    // setX(Math.round(Math.random() * 100));
  }

  return (
    <div width="500px" height="500px">
      {transitions((style, state) =>
        state ?
        <MyCircle1 style={style}/>
        :
        <MyCircle2 style={style}/>
      )}
      <button onClick={handleClick}>toggle</button>
      <button onClick={handleClick2}>move</button>
      {/* <button onClick={handleClick3}>move</button> */}
    </div>
  )
}


// other exmaple 
// import React, { useState } from 'react';
// import { useSpring, animated } from '@react-spring/web';
// // import './Test.css';

// export default function Test() {
//   const [toggleMove, setToggleMove] = useState(false);
//   const [toggleFace, setToggleFace] = useState(false);

//   const moveStyles = useSpring({
//     transform: toggleMove ? 'translate(100px, 100px)' : 'translate(0px, 0px)',
//     config: { duration: 500 }
//   });

//   const faceStyles = useSpring({
//     d: toggleFace
//       ? 'M10 80 Q 95 10 180 80 T 350 80'
//       : 'M10 80 Q 95 150 180 80 T 350 80',
//     config: { 
//       mass: 3,
//     }
//   });

//   return (
//     <div id='test'>
//       <animated.svg width="400" height="200" style={moveStyles}>
//         <animated.path
//           d={faceStyles.d}
//           fill="transparent"
//           stroke="black"
//           strokeWidth="5"
//         />
//       </animated.svg>
//       <button onClick={() => setToggleMove(!toggleMove)}>toggle move</button>
//       <button onClick={() => setToggleFace(!toggleFace)}>toggle face</button>
//     </div>
//   );
// }
