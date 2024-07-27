import { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './FaceMonitorPage.css';
import SpringFace from "../Components/SpringFace"
import LOCALHOST from "../constants/ip"


const IDENTITY = 'FACE_MONITOR';

function FacePage() {
  const [face, setFace] = useState('bb');
  const [move, setMove] = useState(false);

  // subcriber
  useEffect(() => {
    const subscriber = new EventSource(`${LOCALHOST}:11450/faceMonitor/subscribe`);
    subscriber.onopen = () => {
      console.log('Backend Connection Opened');
    };
    subscriber.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(`=====================\nA data is received`);
      if ( data.face ) {
        setFace(data.face);
        console.log(`Face received: ${data.face}`);
      }
      if ( data.move ) {
        setMove(data.move === "true" ? true : false);
        console.log(`Move received: ${data.move}`);
      }
    };
    subscriber.onerror = function(error) {
      console.log("FaceMonitor Subcribe failed:", error);
      subscriber.close();
    }
  }, []);


  return (
    <div id="face-page">
      <h1>{face} {move ? "moving" : "static"}</h1>
      <SpringFace face={face} move={move} />
      {/* <Face face={face} move={move} /> */}
    </div>
  );
}

export default FacePage;
