import "./Face.css";
import { useEffect, useRef } from 'react';
import p5 from 'p5';
import waiter from "../utils/utils";


function Eyes({ eye, move=false }) {
  const eyeRef = useRef(eye);

  const parentRef = useRef(null);
  const sizeRef = useRef(null);

  const [center_xl, center_xr, center_y] = [useRef(0), useRef(0), useRef(0)];
  const [xl, xr, y] = [useRef(0), useRef(0), useRef(0)];
  
  const timerRef = useRef(null);
  const moveRef = useRef(move);
  const waitMoveRef = useRef(true);
  const randomMoveRef = useRef(null);

  const testRef = useRef(0);

  useEffect(() => {
    console.log("init eyes logic");
    parentRef.current = document.getElementById('eyes');
    sizeRef.current = {w: parentRef.current.clientWidth, h: parentRef.current.clientHeight};
    [xl.current, xr.current] = [sizeRef.current.w / 4, sizeRef.current.h * 3/4];
    y.current = sizeRef.current.h / 2;

    const resizeObserver = new ResizeObserver((entries) => {
      // console.log(entries.length);
      for (let entry of entries) {
        const [w, h] = [entry.contentRect.width, entry.contentRect.height];
        
        sizeRef.current = {w: Math.round(w), h: Math.round(h)};

        [center_xl.current, center_xr.current] = [Math.round(w / 4), Math.round(w * 3/4)];
        center_y.current = Math.round(h / 2);
        [xl.current, xr.current] = [Math.round(w / 4), Math.round(w * 3/4)];
        y.current = Math.round(h / 2);

        // entry.target是被观察的元素
        // entry.contentRect包含元素的尺寸信息
      }
    });
    resizeObserver.observe(parentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);


  useEffect(() => {
    console.log("init random move");
    waitMoveRef.current = true;

    function delay(time) {
      return new Promise(resolve => {
        console.log("delaying");
        timerRef.current = setTimeout(resolve, time)
      });
    }

    async function mover(target_xl, target_y) {
      const time = 500;         // 500ms内移动完
      const timeInterval = 10;  // 每10ms移动一次
      const step_x = (target_xl - xl.current) / (time / timeInterval);
      const step_y = (target_y - y.current) / (time / timeInterval);
      for (let i = 0; i < time; i += timeInterval) {
        xl.current += step_x;
        xr.current += step_x; // 因为两只眼睛要移动的方向和距离是一样的
        y.current += step_y;
        await waiter("", timeInterval);
      }
    }

    // randomMoveRef.current = 
    new Promise(async (resolve) => {
      while (waitMoveRef.current) {
        if (moveRef.current === false) {
          xl.current = center_xl.current;
          xr.current = center_xr.current;
          y.current = center_y.current;
          await waiter("move", 2000);
          continue;
        } else {
          const time1 = (Math.random() * 3 + 2) * 1000; // 与上一次之间的间隔时间
          // console.log("time1:", time1);
          await delay(2000);
          // console.log("time1:", time1);
          const [w, h] = [sizeRef.current.w, sizeRef.current.h];
          const offset_x = Math.round(Math.random() * (w*0.2 - 0) - w*0.1); 
          const offset_y = Math.round(Math.random() * (h*0.2 - 0) - h*0.1);
          // console.log(offset_x, offset_y);
          // update next eye position
          // mover(center_xl.current + offset_x, center_y.current + offset_y);
          const moveTime = 500;     // 500ms内移动完
          const timeInterval = 10;  // 每10ms移动一次
          const step_x = (center_xl.current + offset_x - xl.current) / (moveTime / timeInterval);
          const step_y = (center_y.current + offset_y - y.current) / (moveTime / timeInterval);
          for (let i = 0; i < moveTime; i += timeInterval) {
            xl.current += step_x;
            xr.current += step_x; // 因为两只眼睛要移动的方向和距离是一样的
            y.current += step_y;
            await waiter("", timeInterval);
          }
          console.log(testRef.current++);
        }
      }
      resolve();
    });

    return async () => {
      console.log("dismounting random move");
      waitMoveRef.current = false;
      clearTimeout(timerRef.current);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
}, []);


  // set eye type
  useEffect(() => {
    console.log("update eye:", eye);
    eyeRef.current = eye;
  }, [eye]);

  // set radom move
  useEffect(() => {
    console.log("update move:", move);
    moveRef.current = move;
  }, [move]);

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
        // const [w, h] = [sizeRef.current.w, sizeRef.current.h];
        p.resizeCanvas(sizeRef.current.w, sizeRef.current.h);
        if ( eyeRef.current === "smile" ) {
          // left eye
          // console.log(xl.current, y.current);
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
        }
      }
    });
    return () => {
      EyesCanvas.remove();
    }
  }, []);

  return (
    <div id="eyes">
    </div>
  );
}

function Mouth({ mouth }) {
  // const mouthRef = useRef(null);
  // const resizeRef = useRef(null);
  // const sizeRef = useRef(null);

  // useEffect(() => {
  //   mouthRef.current = mouth;
  //   resizeRef.current = new ResizeObserver((entries) => {
  //     // console.log(entries.length);
  //     for (let entry of entries) {
  //       sizeRef.current = {w: entry.contentRect.width, h: entry.contentRect.height};
  //     }
  //   }).observe(document.getElementById('mouth'));
  // }, []);

  // // 试一下借助props改变就重新渲染的特性去除这个useEffect
  // useEffect(() => {
  //   mouthRef.current = mouth;
  // }, [mouth]);

  // useEffect(() => {
  //   let MouthCanvas = new p5((p) => {
  //     p.setup = () => {
  //       let canvas = p.createCanvas(sizeRef.current.w, sizeRef.current.h * 0.5); 
  //       canvas.parent('mouth'); // 将canvas设置为id为'eyes'的元素的子元素
  //       // p.noStroke();
  //     };
  //     // p.draw = () => {
  //     //   p.background(0);
  //     //   const [w, h] = [sizeRef.current.w, sizeRef.current.h];
  //     //   p.resizeCanvas(w, h);
  //     //   const [x, y] = [w / 2, h / 2];
  //     //   if ( mouthRef.current === "smile" ) {
  //     //     p.arc(x, y, 200, 100, 0, p.PI);
  //     //     p.fill(255);
  //     //   }
  //     // }
  //   });
  //   return () => {
  //     MouthCanvas.remove();
  //   }
  // }, []);

  return (
    <div id="mouth"></div>
  );
}

function Face({ face, move }) {

  return (
    <div id="face">
      <Eyes eye={face} move={move}/>
      <Mouth mouth={face}/>
    </div>
  );
}


export default Face;
