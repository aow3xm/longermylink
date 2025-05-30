import React from 'react';

// Mock component đơn giản
const LoginPage = () => {
  return (
    <div className="container">
      <form>
        <div>
          <label htmlFor="email">emailLabel</label>
          <input 
            id="email" 
            type="email" 
            placeholder="emailPlaceholder" 
            required 
            autoComplete="email" 
          />
        </div>
        
        <div>
          <label htmlFor="password">passwordLabel</label>
          <input 
            id="password" 
            type="password" 
            placeholder="passwordPlaceholder" 
            required 
            autoComplete="current-password" 
          />
        </div>
        
        <button type="submit">signInButton</button>
        
        <div>
          <a href="/forgot-password">forgotPassword</a>
        </div>
        
        <div>
          <a href="/register">signUp</a>
        </div>
        
        <button type="button">
          <span>GithubIcon</span>
          signInWithGithub
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
