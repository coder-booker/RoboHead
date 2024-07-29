import { useState } from 'react';
import './ControlPanel.css';
import LOCALHOST from "./ip";

function ControlPanel() {
  const [face, setFace] = useState('bb');
  const [move, setMove] = useState(false);


  const changeFace = async (face) => {
    console.log(`Setting face: ${face}`);
    const res = await fetch(`${LOCALHOST}:11450/setFace?data=${face}`, {
      method: 'POST'
      // , 
      // headers: {
      //   'Cache-Control': 'no-cache, no-store, must-revalidate',
      //   'Pragma': 'no-cache',
      //   'Expires': '0'
      // }
    });
    const resText = await res.text();
    if ( res.ok ) {
      setFace(face);
      console.log(`Face successfully set: ${resText}`);
    } else {
      alert(`Face fail set: ${resText}`);
    }

  }

  const toggleMove = async (target) => {
    console.log(`Setting move: ${!move}`);
    if (target) {
      const res = await fetch(`${LOCALHOST}:11450/setMove?data=${target}`, {
        method: 'POST'
      });
  
      const resText = await res.text();
      if ( res.ok ) {
        setMove(target);
        console.log(`Move successfully set: ${resText}`);
      } else {
        alert(`Move fail set: ${resText}`);
      }
      return;
    }
    const res = await fetch(`${LOCALHOST}:11450/setMove?data=${!move}`, {
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
      <div>
        <button onClick={() => {changeFace("bb")}}>bb</button>
        <button onClick={() => {changeFace("bb_wink")}}>bb_wink</button>
        <button onClick={() => {changeFace("bb_smile")}}>bb_smile</button>
        <button onClick={() => {changeFace("bb_excited")}}>bb_excited</button>
      </div>
      <button onClick={() => {changeFace("bronya")}}>bronya</button>
      <button onClick={() => {changeFace("ig");}}>ig</button>
      <button onClick={() => {toggleMove()}}>Toggle move</button>
      <h1>Current status: {face}, {move ? "moving" : "static"}</h1>
    </div>
  );
}

export default ControlPanel;