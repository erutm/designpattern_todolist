import React, { useState } from 'react';
import './App.css';
import TodoApp from './TodoApp';
import Login from './Login';
import Register from './Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('user');
  });
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  const handleRegister = () => {
    setIsRegistering(false);  // Setelah registrasi berhasil, kembalikan ke login
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <TodoApp />
        </div>
      ) : isRegistering ? (
        <Register onRegister={handleRegister} toggleLogin={() => setIsRegistering(false)} />
      ) : (
        <Login onLogin={handleLogin} toggleRegister={() => setIsRegistering(true)} />
      )}

      {/* Tombol untuk toggle antara Register dan Login */}
      {!isLoggedIn && (
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Back to Login' : 'Register'}
        </button>
      )}
    </div>
  );
}

export default App;
