// import { useState } from "react";
import './ControlPanel.css';
import { useState } from 'react';

function ControlPanel() {
  const [face, setFace] = useState('smile');
  const [move, setMove] = useState(false);


  const changeFace = async (face) => {
    console.log(`Setting face: ${face}`);
    const res = await fetch(`http://localhost:11451/setFace?data=${face}`, {
      method: 'POST'
    });
    const resText = await res.text();
    if ( res.ok ) {
      setFace(face);
      console.log(`Face successfully set: ${resText}`);
    } else {
      alert(`Face fail set: ${resText}`);
    }
  }

  const toggleMove = async () => {
    console.log(`Setting move: ${!move}`);
    const res = await fetch(`http://localhost:11451/setMove?data=${!move}`, {
      method: 'POST'
    });
    const resText = await res.text();
    if ( res.ok ) {
      setMove(!move);
      console.log(`Move successfully set: ${resText}`);
    } else {
      alert(`Move fail set: ${resText}`);
    }
  }

  return (
    <div id="control-panel">
      <button onClick={() => {changeFace("smile")}}>face1</button>
      <button onClick={() => {changeFace("cry")}}>face2</button>
      <button onClick={() => {changeFace("laugh")}}>face3</button>
      <button onClick={() => {toggleMove()}}>Toggle move</button>
      <h1>Current status: {face}, {move ? "moving" : "static"}</h1>
    </div>
  );
}

export default ControlPanel;