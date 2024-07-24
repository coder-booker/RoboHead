import { useEffect, useRef } from 'react';
import p5 from 'p5';

import unitWait from "../utils/utils";
import "./Face.css";


function Eyes({ eyeType, move=false }) {
  const eyeTypeRef = useRef(eyeType);

  const parentRef = useRef(null);
  const sizeRef = useRef(null);

  const [center_xl, center_xr, center_y] = [useRef(0), useRef(0), useRef(0)];
  const [xl, xr, y] = [useRef(0), useRef(0), useRef(0)];
  
  const moveRef = useRef(move);
  const moveRepeatRef = useRef(true);
  
  const timerRef = useRef(null);
  const testRef = useRef(0);


  // init some variables
  useEffect(() => {
    console.log("init eyes logic");
    parentRef.current = document.getElementById('eyes');
    sizeRef.current = {w: parentRef.current.clientWidth, h: parentRef.current.clientHeight};
    [xl.current, xr.current] = [sizeRef.current.w / 4, sizeRef.current.h * 3/4];
    y.current = sizeRef.current.h / 2;
  }, []);

  // init resize listener
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const [w, h] = [entry.contentRect.width, entry.contentRect.height];
        
        sizeRef.current = {w: Math.round(w), h: Math.round(h)};
        [center_xl.current, center_xr.current] = [Math.round(w / 4), Math.round(w * 3/4)];
        center_y.current = Math.round(h / 2);
        [xl.current, xr.current] = [Math.round(w / 4), Math.round(w * 3/4)];
        y.current = Math.round(h / 2);
      }
    });
    resizeObserver.observe(parentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  });

  // init move logic
  useEffect(() => {
    console.log("init move");
    moveRepeatRef.current = true;

    // declared at here because of the timerRef update
    function waitNextMove(time) {
      return new Promise(resolve => {
        timerRef.current = setTimeout(resolve, time)  // for instant stop
      });
    }

    // async-ly start move and repeat 
    new Promise(async (resolve) => {
      while (moveRepeatRef.current) {
        if (moveRef.current === false) {
          xl.current = center_xl.current;
          xr.current = center_xr.current;
          y.current = center_y.current;
          await waitNextMove("move", 2000);
          continue;
        }
        const moveInterval = (Math.random() * 3 + 2) * 1000; // 与上一次之间move的间隔时间
        await waitNextMove(moveInterval);
        // generate next move position offset
        const [w, h] = [sizeRef.current.w, sizeRef.current.h];
        const offset_x = Math.round(Math.random() * (w*0.2 - 0) - w*0.1);
        const offset_y = Math.round(Math.random() * (h*0.2 - 0) - h*0.1);

        // update next eye position
        const oneMoveTime = 100;      // 500ms内移动完
        const moveUnitTime = 5;       // 每10ms移动一次
        const step_x = (center_xl.current + offset_x - xl.current) / (oneMoveTime / moveUnitTime);
        const step_y = (center_y.current + offset_y - y.current) / (oneMoveTime / moveUnitTime);
        // for prettier move
        for (let i = 0; i < oneMoveTime; i += moveUnitTime) {
          xl.current += step_x;
          xr.current += step_x;   // 因为两只眼睛要移动的方向和距离是一样的
          y.current += step_y;
          await unitWait(moveUnitTime); // 控制到oneMoveTime时移动完
        }
      }
      resolve();
    });

    return async () => {
      // console.log("dismounting random move");
      moveRepeatRef.current = false;
      clearTimeout(timerRef.current);
    }
  }, []);

  // init canvas
  useEffect(() => {
    console.log("init canvas");
    let EyesCanvas = new p5((p) => {
      p.setup = () => {
        let canvas = p.createCanvas(sizeRef.current.w, sizeRef.current.h); 
        canvas.parent(parentRef.current); // 将canvas设置为id为'eyes'的元素的子元素
        p.noStroke();
      };
      p.draw = () => {
        p.background(0);
        p.resizeCanvas(sizeRef.current.w, sizeRef.current.h);
        switch (eyeTypeRef.current) {
          case "bb" :
            // left eye
            p.noStroke();
            p.ellipse(xl.current, y.current, 100, 100);
            p.fill(255);
            p.ellipse(xl.current, y.current, 80, 80);
            p.fill(0);
            p.ellipse(xl.current, y.current, 60, 60);
            p.fill(255);
            // right eye
            p.ellipse(xr.current, y.current, 100, 100);
            p.fill(255);
            p.ellipse(xr.current, y.current, 80, 80);
            p.fill(0);
            p.ellipse(xr.current, y.current, 60, 60);
            p.fill(255);
            break;
          case "bronya":
            p.noFill();
            p.stroke(255);
            p.strokeWeight(2);
            const [rect_w, rect_h] = [120, 100];
            // left
            p.beginShape();
            p.vertex(xl.current-rect_w/2, y.current+rect_h/2); // 左下角
            p.vertex(xl.current-rect_w/2, y.current-rect_h/2); // 左上角
            p.vertex(xl.current+rect_w/2, y.current-rect_h/2); // 右上角
            p.vertex(xl.current+rect_w/2, y.current+rect_h/2); // 右下角
            p.endShape();
            p.arc(xl.current, y.current+rect_h/2, rect_w, rect_h, 0, p.PI);
            // right
            p.beginShape();
            p.vertex(xr.current-rect_w/2, y.current+rect_h/2); // 左下角
            p.vertex(xr.current-rect_w/2, y.current-rect_h/2); // 左上角
            p.vertex(xr.current+rect_w/2, y.current-rect_h/2); // 右上角
            p.vertex(xr.current+rect_w/2, y.current+rect_h/2); // 右下角
            p.endShape();
            p.arc(xr.current, y.current+rect_h/2, rect_w, rect_h, 0, p.PI);
            break;
          }
        }
      });
      return () => {
        EyesCanvas.remove();
      }
    }, []);
    
  // update eye type
  useEffect(() => {
    console.log("update eyeType:", eyeType);
    eyeTypeRef.current = eyeType;
  }, [eyeType]);

  // update radom move
  useEffect(() => {
    console.log("update move:", move);
    moveRef.current = move;
  }, [move]);


  return (
    <div id="eyes">
    </div>
  );
}

function Mouth({ mouth }) {
  const mouthRef = useRef(mouth);

  const parentRef = useRef(null);
  const sizeRef = useRef(null);

  const [center_x, center_y] = [useRef(0), useRef(0)];
  const [x, y] = [useRef(0), useRef(0)];

  // init some variables
  useEffect(() => {
    console.log("init mouth logic");
    parentRef.current = document.getElementById('mouth');
    sizeRef.current = {w: parentRef.current.clientWidth, h: parentRef.current.clientHeight};
    [x.current, y.current] = [sizeRef.current.w / 2, sizeRef.current.h / 2];
  }, []);

  // init resize listener
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const [w, h] = [entry.contentRect.width, entry.contentRect.height];
        
        sizeRef.current = {w: Math.round(w), h: Math.round(h)};
        [center_x.current, center_y.current] = [Math.round(w / 2), Math.round(h / 2)];
        [x.current, y.current] = [sizeRef.current.w / 2, Math.round(h / 2)];
      }
    });
    resizeObserver.observe(parentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  });

  // 试一下借助props改变就重新渲染的特性去除这个useEffect
  useEffect(() => {
    console.log("update mouth:", mouth);
    mouthRef.current = mouth;
  }, [mouth]);

  useEffect(() => {
    let MouthCanvas = new p5((p) => {
      p.setup = () => {
        let canvas = p.createCanvas(sizeRef.current.w, sizeRef.current.h * 0.5); 
        canvas.parent('mouth'); // 将canvas设置为id为'eyes'的元素的子元素
        // p.noStroke();
      };
      p.draw = () => {
        p.background(0);
        const [w, h] = [sizeRef.current.w, sizeRef.current.h];
        p.resizeCanvas(w, h);
        switch ( mouthRef.current ) {
          case "bb":
            // p.arc(x, y, 200, 100, 0, p.PI);
            // p.fill(255);
            break;
          case "bronya":
            // console.log("bronya mouth");
            p.noFill();
            p.stroke(255);
            p.strokeWeight(5);
            const [rect_w, rect_h] = [70, 20];
            const mouthOffset = 50;
            p.beginShape();
            p.vertex(x.current-rect_w/2, y.current + rect_h/2 - mouthOffset);
            p.vertex(x.current, y.current - rect_h/2 - mouthOffset);
            p.vertex(x.current+rect_w/2, y.current+rect_h/2 - mouthOffset);
            p.endShape();
            break;
        }
      }
    });
    return () => {
      MouthCanvas.remove();
    }
  }, []);

  return (
    <div id="mouth"></div>
  );
}

function Face({ face, move }) {

  return (
    <div id="face">
      <Eyes eyeType={face} move={move}/>
      <Mouth mouth={face}/>
    </div>
  );
}


export default Face;
