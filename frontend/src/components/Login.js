import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/auth-status`, {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.authenticated) {
          // User is already logged in, redirect to instructions
          navigate('/instructions');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify({
          user: { email }
        }),
      });

      if (response.ok) {
        navigate('/instructions');
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="center">
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <div className="txt_field">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <label htmlFor="email">EMAIL</label>
        </div>
        <input 
          type="submit" 
          id="submit-email" 
          value={isSubmitting ? "Submitting..." : "Submit Email"}
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
}

export default Login;
