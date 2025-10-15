import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Game.css';

function Game() {
  const [gameState, setGameState] = useState('countdown');
  const [currentNumber, setCurrentNumber] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('rgb(255, 255, 255)');
  const [stats, setStats] = useState({ correct: 0, avgTime: 0 });
  const [showStats, setShowStats] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  
  // Game data - following original logic exactly
  const [gameData, setGameData] = useState({
    currentIter: 0,
    maxIter: location.pathname.includes('trial') ? 14 : 164, // 14 = 10+4, 164 = 160+4
    timeArray: [],
    numArray: [],
    colArray: [],
    keyArray: [],
    checkArray: []
  });

  // Color constants
  const blueColor = "rgb(103, 165, 255)";
  const pinkColor = "rgb(216, 103, 255)";
  const whiteColor = "rgb(255, 255, 255)";


  const generateNumber = (currNum) => {
    let tempNum = Math.floor(Math.random() * 10);
    
    while (tempNum === parseInt(currNum) || tempNum === 5 || tempNum === 0) {
      tempNum = Math.floor(Math.random() * 10);
    }
    
    setGameData(prev => ({
      ...prev,
      numArray: [...prev.numArray, tempNum]
    }));
    
    return tempNum;
  };

  const showGameStats = () => {
    setGameState('stats');
    setBackgroundColor(whiteColor);
    setCurrentNumber('');
    
    // Calculate statistics - following original logic
    setGameData(prev => {
      const timeArray = prev.timeArray.filter(time => time > 0);
      const sum = timeArray.reduce((acc, time) => acc + time, 0);
      const avgTime = timeArray.length > 0 ? Math.round(sum / timeArray.length) : 0;
      const correctCount = prev.checkArray.reduce((sum, result) => sum + result, 0);
      
      setStats({ correct: correctCount, avgTime });
      setShowStats(true);
      
      return prev;
    });
  };

  const changeRandColorNumber = useCallback(() => {
    setGameData(prev => {
      const newIter = prev.currentIter + 1;
      
      // Set new current time for reaction measurement
      startTimeRef.current = Date.now();
      
      // Check if we've reached the actual game iterations (maxIter - 4 for countdown)
      const gameIterations = prev.maxIter - 4;
      if (newIter > gameIterations) {
        // Game finished - record max time for any unrecorded iterations
        const newTimeArray = [...prev.timeArray];
        const newKeyArray = [...prev.keyArray];
        const newCheckArray = [...prev.checkArray];
        
        // Fill in any missing time values with 1500ms (max interval time)
        for (let i = 0; i < gameIterations; i++) {
          if (newTimeArray[i] === undefined) {
            newTimeArray[i] = 1500; // Max time for no response
            newKeyArray[i] = "N/A";
            newCheckArray[i] = 0; // Incorrect for no response
          }
        }
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        // Update data before showing stats
        setGameData(prev => ({
          ...prev,
          timeArray: newTimeArray,
          keyArray: newKeyArray,
          checkArray: newCheckArray
        }));
        
        showGameStats();
        return prev;
      }

      // Show numbers/colors immediately (countdown is handled separately)
      const newColor = Math.random() < 0.5 ? blueColor : pinkColor;
      const colorName = newColor === blueColor ? "Blue" : "Pink";
      
      setBackgroundColor(newColor);
      
      // Handle number generation
      const newNum = generateNumber(prev.numArray[prev.numArray.length - 1] || 0);
      setCurrentNumber(newNum);

      return {
        ...prev,
        currentIter: newIter,
        colArray: [...prev.colArray, colorName]
      };
    });
  }, []);

  const countDownScreen = useCallback(() => {
    setBackgroundColor(whiteColor);
    setGameState('countdown');
    let count = 4;
    
    const countdownInterval = setInterval(() => {
      if (count === 0) {
        clearInterval(countdownInterval);
        setGameState('playing');
        setCurrentNumber('');
        
        // Reset currentIter to 0 and start the actual game
        setGameData(prev => ({ ...prev, currentIter: 0 }));
        
        // Call immediately for the first number, then start the interval
        changeRandColorNumber();
        
        // Start the game interval for subsequent numbers
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(changeRandColorNumber, 1500);
      } else {
        setCurrentNumber(count === 1 ? '' : count - 1);
        count--;
      }
    }, 1000);
  }, [changeRandColorNumber]);

  const submitData = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare structured data object
      const gameIterations = gameData.maxIter - 4;
      const structuredData = {
        gameType: location.pathname.includes('trial') ? 'trial' : 'full',
        iterations: gameIterations,
        results: {
          correctAnswers: stats.correct,
          totalAnswers: gameIterations,
          averageReactionTime: stats.avgTime,
          accuracy: Math.round((stats.correct / gameIterations) * 100)
        },
        trials: []
      };

      // Create structured trial data
      for (let i = 0; i < gameIterations; i++) {
        structuredData.trials.push({
          iteration: i + 1,
          number: gameData.numArray[i] || 0,
          color: gameData.colArray[i] || '',
          keyPressed: gameData.keyArray[i] || 'N/A',
          reactionTime: gameData.timeArray[i] || 0,
          correct: gameData.checkArray[i] === 1
        });
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify({ data: structuredData }),
      });

      if (response.ok) {
        navigate('/end');
      } else {
        console.error('Failed to submit data');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start countdown when component mounts or route changes
  useEffect(() => {
    // Reset game state when route changes
    setGameState('countdown');
    setCurrentNumber('');
    setBackgroundColor(whiteColor);
    setShowStats(false);
    setStats({ correct: 0, avgTime: 0 });
    setIsSubmitting(false);
    
    // Reset game data with proper array initialization
    const maxIter = location.pathname.includes('trial') ? 14 : 164;
    const gameIterations = maxIter - 4;
    const checkArray = new Array(gameIterations).fill(0);
    const keyArray = new Array(gameIterations).fill("N/A");
    
    setGameData({
      currentIter: 0,
      maxIter,
      timeArray: [],
      numArray: [],
      colArray: [],
      keyArray,
      checkArray
    });
    
    // Clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Start countdown
    countDownScreen();
  }, [location.pathname, countDownScreen]);

  // Add keyboard event listener - following original logic
  useEffect(() => {
    const keyHandler = (event) => {
      if (gameState !== 'playing' || gameData.currentIter <= 0) {
        return;
      }

      const keyName = event.key.toUpperCase();
      if (!['Z', 'X', 'N', 'M'].includes(keyName)) {
        return;
      }

      // Calculate reaction time
      const reactionTime = Date.now() - startTimeRef.current;
      
      // Update arrays
      setGameData(prev => {
        const newKeyArray = [...prev.keyArray];
        const newCheckArray = [...prev.checkArray];
        const newTimeArray = [...prev.timeArray];
        
        // Index calculation: currentIter - 1 (since we start from 1)
        const index = prev.currentIter - 1;
        newKeyArray[index] = keyName;
        newTimeArray[index] = reactionTime;
        
        // Check if answer is correct
        const currentColor = prev.colArray[index] || '';
        const currentNum = prev.numArray[index] || 0;
        let result = 0;
        
        if (currentColor === "Blue") {
          if (currentNum < 5) {
            result = keyName === "Z" ? 1 : 0;
          } else if (currentNum > 5) {
            result = keyName === "X" ? 1 : 0;
          }
        } else {
          if (currentNum % 2 === 0) {
            result = keyName === "M" ? 1 : 0;
          } else {
            result = keyName === "N" ? 1 : 0;
          }
        }
        
        newCheckArray[index] = result;
        
        return {
          ...prev,
          keyArray: newKeyArray,
          checkArray: newCheckArray,
          timeArray: newTimeArray
        };
      });

      // Clear and restart interval (following original logic)
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(changeRandColorNumber, 1500);
      
      // Proceed to next screen immediately after keypress
      setTimeout(() => {
        changeRandColorNumber();
      }, 0);
    };

    window.addEventListener('keydown', keyHandler);
    return () => {
      window.removeEventListener('keydown', keyHandler);
    };
  }, [gameState, gameData.currentIter, gameData.maxIter, changeRandColorNumber]);

  return (
    <div className="game-main">
      <div className="rectangle" style={{ background: backgroundColor }}>
        <div className="number">{currentNumber}</div>
      </div>
      
      {showStats && (
        <div className="stats-rectangle">
          <h1>{location.pathname.includes('trial') ? 'TRIAL RESULTS' : 'TEST RESULTS'}</h1>
          <div className="answer">
            <h2>Correct Answers:</h2>
            <p className="correct-answer">{stats.correct}</p>
          </div>
          <div className="time">
            <h2>Average Reaction Time {location.pathname.includes('trial') ? '' : '(in ms)'}:</h2>
            <p className="avg-time">{stats.avgTime}</p>
          </div>
          <button 
            onClick={location.pathname.includes('trial') ? () => navigate('/game') : submitData} 
            id="next-button"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? "Submitting..." 
              : location.pathname.includes('trial') 
                ? "Press to START TEST" 
                : "Press to FINISH TEST"
            }
          </button>
        </div>
      )}
    </div>
  );
}

export default Game;