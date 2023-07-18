import React, { useState } from 'react';
import Login from './Login'

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you can replace the API call with your actual backend implementation
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        // Handle error response from the server
        const errorData = await response.json();
        console.log('Error:', errorData.message);
      }
    } catch (error) {
      // Handle network or other errors
      console.log('Error:', error.message);
    }
  };

  return (
    <div>
      {isSubmitted ? (
        <div>
          <h2>Password Reset Email Sent</h2>
          <p>An email with instructions to reset your password has been sent to your email address.</p>
         
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Forgot Password</h2>
          <p>Enter your email address below and we'll send you instructions to reset your password.</p>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Reset Password</button>
          <p>Click <a href="/">here</a> to go back to the login page.</p>
        </form>
        
      )}
      
    </div>
  );
};

export default ForgotPassword;
