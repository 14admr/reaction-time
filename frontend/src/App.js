import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Instructions from './components/Instructions';
import Game from './components/Game';
import End from './components/End';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/trial" element={<Game />} />
          <Route path="/game" element={<Game />} />
          <Route path="/end" element={<End />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
