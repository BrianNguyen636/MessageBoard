import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ThreadPage from './components/ThreadPage';
import Login from './components/Login';
import Signup from './components/Signup';
import CreateThread from './components/CreateThread';
import CreatePost from './components/CreatePost';
import { useAuth } from './AuthContext';

import './App.css';

function App() {
  const { user, logout } = useAuth();

  return (
      <div className="container">
          <header>
              <h1>MessageBoard</h1>
              <nav className="navBar">
                  <Link to="/">Home</Link>
                  {user ? (
                      <>
                          <span>Welcome, {user.username}</span>
                          <Link to="/create-thread">Create Thread</Link>
                          <button onClick={logout}>Logout</button>
                      </>
                  ) : (
                      <>
                          <Link to="/login">Login</Link>
                          <Link to="/signup">Sign Up</Link>
                      </>
                  )}
              </nav>
          </header>
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/thread/:id" element={<ThreadPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create-thread" element={<CreateThread />} />
          <Route path="/thread/:id/create-post" element={<CreatePost />} />
              <Route path="/thread/:id/create-post/:replyID" element={<CreatePost />} />
        </Routes>
      </div>
  );
}

export default App;
