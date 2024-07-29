import { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './FacePage.css';
// import Face from "../Components/Face"
import SpringFace from "../Components/SpringFace"
import LOCALHOST from "../constants/ip"


const IDENTITY = 'FACE';

function FacePage() {
  const [face, setFace] = useState('bb');
  const [move, setMove] = useState(false);

  // subcriber
  useEffect(() => {
    // const subscriber = new WebSocket(`ws:${testLocalhost}:11451/face/subscribe`);

    const subscriber = new EventSource(`${LOCALHOST}:11450/face/subscribe`);
    subscriber.onopen = () => {
      console.log('Backend Connection Opened');
      // subscriber.send(JSON.stringify({ identity: IDENTITY }));
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
      console.log("Face Subcriber failed:", error);
      // subscriber.send(JSON.parse({identity: IDENTITY, error: error.message}));
      subscriber.close();
    };

    subscriber.onclose = function(error) {
      console.log("Face Subcriber failed:", error);
      subscriber.close();
    };
  }, []);


  return (
    <div id="face-page">
      {/* <h1>{face} {move ? "moving" : "static"}</h1> */}
      <SpringFace face={face} move={move} />
      {/* <Face face={face} move={move} /> */}
    </div>
  );
}

export default FacePage;
