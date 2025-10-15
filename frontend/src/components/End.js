import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './End.css';

function End() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/logout`, {
        method: 'POST',
        credentials: 'include', // Include cookies for session
      });
      
      if (response.ok) {
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="end-container">
      <div className="end-content">
        <h1>Thank You!</h1>
        <p>Your reaction time test has been completed successfully.</p>
        <p>The results have been recorded.</p>
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="logout-button"
        >
          {isLoggingOut ? 'Logging out...' : 'Start New Test'}
        </button>
      </div>
    </div>
  );
}

export default End;
