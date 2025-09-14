import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Instructions.css';

function Instructions() {
  const navigate = useNavigate();

  const handleStartTrial = () => {
    navigate('/trial');
  };

  return (
    <div className="instruction-main">
      <div className="instruction-title">
        <h1>INSTRUCTIONS</h1>
      </div>
      <div className="instruction-txt">
        <ul id="instruction-txt" style={{ lineHeight: '150%' }}>
          <li>The numbers will be presented individually for <b>1500 ms</b> in a <b><span style={{color:'rgb(255, 30, 206)'}}>PINK</span></b> or <b><span style={{color:'dodgerblue'}}>BLUE</span></b> background at the center of the screen.</li>
          <li>When the background of the screen is <b><span style={{color:'dodgerblue'}}>BLUE</span></b>, the participant will use their <u>left hand</u> to report as quickly as possible whether the number presented in the screen is <b>higher</b> or <b>lower</b> than <b>5</b>.</li>
          <li>The participant will press the <b>"X"</b> key when the number is higher than 5, and <b>"Z"</b> key when it is <b>lower</b> than <b>5</b>.</li>
          <li>Meanwhile, if the background is <b><span style={{color:'rgb(255, 30, 206)'}}>PINK</span></b>, the participant will use their <u>right hand</u> to report as quickly as possible whether the number in the screen is <b>odd</b> or <b>even</b>.</li>
          <li>The participant will press the <b>"N"</b> key if the number is <b>odd</b>, and <b>"M"</b> key if the number is <b>even</b>.</li>
        </ul>
      </div>
      <button onClick={handleStartTrial} id="instruction-submit">
        Press to start trial!
      </button>
    </div>
  );
}

export default Instructions;
