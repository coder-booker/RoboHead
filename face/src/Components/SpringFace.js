import { useEffect, useState, useRef } from "react"
import { useSpring, animated, useTransition } from '@react-spring/web'

import "./Face.css";
// import Eyes from "./Eyes";

const WIDTH = 1200;
const HEIGHT = 250;

const [EYE_XL, EYE_XR, EYE_Y] = [WIDTH/4, WIDTH*3/4, HEIGHT/2];
const EYE_R_HALF = 65;

const temp_offset = 10;
const temp_offset2 = -10;

const EYE_W_HALF = 90;
const EYE_H_HALF = 70;

const EYE_GAP = 40;

const STROKE = 8;

const MOVE_X_RANGE = 150;
const MOVE_Y_RANGE = 100;
const TIME_RANGE = [1, 3];

function Eyes({ eyeType="bb", move=false }) {

  const [center_x, center_y] = [useRef(0), useRef(0)];
  const [xy, setXY] = useState([0, 0]);

  const moveRef = useRef(move);
  const moveRepeatRef = useRef(true);
  
  const timerRef = useRef(null);

  // init move logic
  useEffect(() => {
    console.log("init move");
    
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
          setXY([center_x.current, center_y.current]);
          await waitNextMove("Waiting Move", 2000);
          continue;
        }
        const offset_x = Math.round(Math.random() * MOVE_X_RANGE - MOVE_X_RANGE/2);     // ******************to be done******************
        const offset_y = Math.round(Math.random() * MOVE_Y_RANGE - MOVE_Y_RANGE/2);
        setXY([center_x.current + offset_x, center_y.current + offset_y]);
        
        const moveInterval = (Math.random() * (TIME_RANGE[1]-TIME_RANGE[0]) + TIME_RANGE[0]) * 1000; // 与下一次之间move的间隔时间
        await waitNextMove("Moving", moveInterval);
      }
      resolve();
    });
    
    return async () => {
      // console.log("dismounting random move");
      moveRepeatRef.current = false;
      clearTimeout(timerRef.current);
    }
  }, []);
  
  // update radom move
  useEffect(() => {
    console.log("update move:", move);
    moveRef.current = move;
    if (!move) {
      setXY([center_x.current, center_y.current]);
    }
  }, [move]);
  
  const transitions = useTransition(eyeType, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {
      mass: 2,
    }
  });
  const eyeSpring = useSpring({ 
    x: xy[0],
    y: xy[1],
  });
  
  return (
    <div id="eyes-wrapper">
      {transitions((style, eye) => {
        switch (eye) {
        case "bb":
          return (
            <animated.svg id="eyes-bb" style={{...style, ...eyeSpring}}>
              <circle cx={EYE_XL} cy={EYE_Y+temp_offset} r={EYE_R_HALF*2} fill="#bdff66" />
              <circle cx={EYE_XL} cy={EYE_Y+temp_offset} r={EYE_R_HALF*2-EYE_GAP} fill="black" />
              {/* <circle cx={EYE_XL} cy={EYE_Y} r={EYE_R_HALF*2-40} fill="white" /> */}

              <circle cx={EYE_XR} cy={EYE_Y+temp_offset} r={EYE_R_HALF*2} fill="#bdff66" />
              <circle cx={EYE_XR} cy={EYE_Y+temp_offset} r={EYE_R_HALF*2-EYE_GAP} fill="black" />
              {/* <circle cx={EYE_XR} cy={EYE_Y} r={EYE_R_HALF*2-40} fill="white" /> */}
            </animated.svg>
          );
        case "bb_wink":
          return (
            <animated.svg id="eyes-bb" style={{...style, ...eyeSpring}}>
              <circle cx={EYE_XL} cy={EYE_Y+temp_offset} r={EYE_R_HALF*2} fill="#bdff66" />
              <circle cx={EYE_XL} cy={EYE_Y+temp_offset} r={EYE_R_HALF*2-EYE_GAP} fill="black" />
              {/* <circle cx={EYE_XL} cy={EYE_Y} r={EYE_R_HALF*2-40} fill="white" /> */}
              <path d={`M ${EYE_XR+EYE_W_HALF} ${EYE_Y+EYE_H_HALF+40} 
                      L ${EYE_XR-EYE_W_HALF} ${EYE_Y} 
                      L ${EYE_XR+EYE_W_HALF} ${EYE_Y-EYE_H_HALF-40} `} 
                  fill="transparent" 
                  stroke="#bdff66" 
                  strokeWidth={`${STROKE+20}`}
                  strokeLinejoin="round"
              />

            </animated.svg>
          );
        case "bb_smile":
          return (
            <animated.svg id="eyes" style={{...style, ...eyeSpring}}>
              <path d={`M ${EYE_XL-EYE_W_HALF-40} ${EYE_Y+EYE_H_HALF+50} 
                      A ${EYE_W_HALF+60} ${EYE_H_HALF} 
                      0 0 1 
                      ${EYE_XL+EYE_W_HALF+40} ${EYE_Y+EYE_H_HALF+50}`} 
                  fill="none" 
                  stroke="#bdff66" 
                  strokeWidth={`${STROKE+20}`}
                  strokeLinejoin="round"
              />
              <path d={`M ${EYE_XR-EYE_W_HALF-40} ${EYE_Y+EYE_H_HALF+50} 
                      A ${EYE_W_HALF+60} ${EYE_H_HALF} 
                      0 0 1 
                      ${EYE_XR+EYE_W_HALF+40} ${EYE_Y+EYE_H_HALF+50}`} 
                  fill="none" 
                  stroke="#bdff66" 
                  strokeWidth={`${STROKE+20}`}
                  strokeLinejoin="round"
              />
            </animated.svg>
          );
        case "bb_excited":
          return (
            <animated.svg id="eyes-bb" style={{...style, ...eyeSpring}}>
              <circle cx={EYE_XL} cy={EYE_Y+temp_offset} r={EYE_R_HALF*2} fill="#bdff66" />
              <circle cx={EYE_XL} cy={EYE_Y+temp_offset} r={EYE_R_HALF*2-EYE_GAP} fill="black" />
              {/* <circle cx={EYE_XL} cy={EYE_Y} r={EYE_R_HALF*2-40} fill="white" /> */}

              <circle cx={EYE_XR} cy={EYE_Y+temp_offset} r={EYE_R_HALF*2} fill="#bdff66" />
              <circle cx={EYE_XR} cy={EYE_Y+temp_offset} r={EYE_R_HALF*2-EYE_GAP} fill="black" />
              
              <path 
                d={`M ${EYE_XL-EYE_W_HALF} ${EYE_Y-EYE_H_HALF-40} 
                L ${EYE_XL+EYE_W_HALF+50} ${EYE_Y+20} 
                L ${EYE_XL+EYE_W_HALF} ${EYE_Y-EYE_H_HALF-80} 
                Z`} 
                fill="black" 
                stroke="black" 
                strokeWidth={`${STROKE+20}`} />
              <path 
                d={`M ${EYE_XR+EYE_W_HALF} ${EYE_Y-EYE_H_HALF-40} 
                L ${EYE_XR-EYE_W_HALF-50} ${EYE_Y+20} 
                L ${EYE_XR-EYE_W_HALF} ${EYE_Y-EYE_H_HALF-80} 
                Z`} 
                fill="black" 
                stroke="black" 
                strokeWidth={`${STROKE+20}`} />
              {/* <circle cx={EYE_XR} cy={EYE_Y} r={EYE_R_HALF*2-40} fill="white" /> */}
            </animated.svg>
          );
        case "bronya":
          return (
            <animated.svg id="eyes" style={{...style, ...eyeSpring}}>
              <path d={`M ${EYE_XL-EYE_W_HALF} ${EYE_Y+EYE_H_HALF} 
                      V ${EYE_Y-EYE_H_HALF} 
                      H ${EYE_XL+EYE_W_HALF} 
                      V ${EYE_Y+EYE_H_HALF}`} 
                  fill="transparent" 
                  stroke="white" 
                  strokeWidth={`${STROKE}`}
                  strokeLinejoin="round"
              />
              <path d={`M ${EYE_XL-EYE_W_HALF} ${EYE_Y+EYE_H_HALF} 
                      A ${EYE_W_HALF} ${EYE_W_HALF} 
                      0 0 0 
                      ${EYE_XL+EYE_W_HALF} ${EYE_Y+EYE_H_HALF}`} 
                  fill="none" 
                  stroke="white" 
                  strokeWidth={`${STROKE}`}
                  strokeLinejoin="round"
              />
              <path d={`M ${EYE_XR-EYE_W_HALF} ${EYE_Y+EYE_H_HALF} 
                      V ${EYE_Y-EYE_H_HALF} 
                      H ${EYE_XR+EYE_W_HALF} 
                      V ${EYE_Y+EYE_H_HALF}`} 
                  fill="transparent" 
                  stroke="white" 
                  strokeWidth={`${STROKE}`}
                  strokeLinejoin="round"
              />
              <path d={`M ${EYE_XR-EYE_W_HALF} ${EYE_Y+EYE_H_HALF} 
                      A ${EYE_W_HALF} ${EYE_W_HALF} 
                      0 0 0 
                      ${EYE_XR+EYE_W_HALF} ${EYE_Y+EYE_H_HALF}`} 
                  fill="none" 
                  stroke="white" 
                  strokeWidth={`${STROKE}`}
                  strokeLinejoin="round"
              />
            </animated.svg>
          );
        case "ig":
          // break;
          return (
            <animated.div id="img" style={{...style, ...eyeSpring}}>
              <img src="/picture.png" />
              {/* <div id="arrow"></div> */}
              <img src="/qrcode.png" />
            </animated.div>
          );
        default:
          return (
            <animated.svg id="eyes" style={{...style, ...eyeSpring}}>
              
              <circle cx={EYE_XL} cy={EYE_Y} r="100" fill="white" />
              <circle cx={EYE_XL} cy={EYE_Y} r="80" fill="black" />
              <circle cx={EYE_XL} cy={EYE_Y} r="60" fill="white" />

              <circle cx={EYE_XR} cy={EYE_Y} r="100" fill="white" />
              <circle cx={EYE_XR} cy={EYE_Y} r="80" fill="black" />
              <circle cx={EYE_XR} cy={EYE_Y} r="60" fill="white" />
            </animated.svg>
          );
        }
      })}
    </div>
  );
}

const MOUTH_COORS = [WIDTH/2, HEIGHT/2];
const MOUTH_W_HALF = 40;
const MOUTH_H_HALF = 20;

function Mouth({ mouth }) {
  const [center_x, center_y] = [useRef(0), useRef(0)];

  const transitions = useTransition(mouth, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <div id="mouth-wrapper">
      {transitions((style, mouth) => {
        switch (mouth) {
        // case "bb":
        //   return (
        //     <animated.svg id="mouth" style={{...style}}>
        //       {/* <path 
        //         d={`M ${MOUTH_COORS[0]-MOUTH_W_HALF} ${MOUTH_COORS[1]+MOUTH_H_HALF} L ${MOUTH_COORS[0]} ${MOUTH_COORS[1]-MOUTH_H_HALF} L ${MOUTH_COORS[0]+MOUTH_W_HALF} ${MOUTH_COORS[1]+MOUTH_H_HALF}`} 
        //         fill="transparent" stroke="white" strokeWidth="5" /> */}
        //     </animated.svg>
        //   );
        case "bronya":
          return (
            <animated.svg id="mouth" style={{...style}}>
              <path 
                d={`M ${MOUTH_COORS[0]-MOUTH_W_HALF} ${MOUTH_COORS[1]+MOUTH_H_HALF} 
                L ${MOUTH_COORS[0]} ${MOUTH_COORS[1]-MOUTH_H_HALF} 
                L ${MOUTH_COORS[0]+MOUTH_W_HALF} ${MOUTH_COORS[1]+MOUTH_H_HALF}
                Z`} 
                fill="transparent" stroke="white" strokeWidth="5" />
            </animated.svg>
          );
        }
      })}
    </div>
  );
}


function SpringFace({ face="bb", move=false }) {

  const [eye, setEye] = useState("bb");
  // const [move, setMove] = useState(false);

  return (
    <div id="face">
      {/* <div id='test' >
        <button onClick={() => setMove(!move)}>toggle move</button>
        <button onClick={() => {setEye(eye === "bb" ? "bronya" : "bb"); console.log(12312312)}}>toggle face</button>
      </div> */}
      <Eyes eyeType={face} move={move}/>
      <Mouth mouth={face}/>
    </div>
  );
}


export default SpringFace;
