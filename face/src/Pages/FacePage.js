import './FacePage.css';
import Face from "../Components/Face"
import { useState, useEffect } from 'react';
import {testLocalhost, phoneLocalhost1} from "../constants/ip"


function FacePage() {
  const [face, setFace] = useState('smile');
  const [move, setMove] = useState(false);

  // subcriber
  useEffect(() => {
    const subscriber = new EventSource(`${phoneLocalhost1}:11451/subscribe`);
    subscriber.onopen = () => {
      console.log('Connection opened');
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
      console.log("EventSource failed:", error);
      try { 
        fetch('http://localhost:11451/faceError', { method: 'POST' });
      } catch (err) {
        console.log(`faceError ERROR: ${err}`);
      }
    };

    // 清理函数
    return () => {
      subscriber.close();
    };
  }, []);


  return (
    <div id="face-page">
      <h1>{face} {move ? "moving" : "static"}</h1>
      <Face face={face} move={move} />
    </div>
  );
}

export default FacePage;
