import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import ArticleView from './pages/ArticleView';
import ArticleEditor from './pages/ArticleEditor';
import Events from './pages/Events';
import Files from './pages/Files';
import Games from './pages/Games';
import AdminPanel from './pages/AdminPanel';
import Navigation from './components/Navigation';
import './App.css';

interface User {
  id: number;
  nickname: string;
  email: string;
  role: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <BrowserRouter>
      <div className="app">
        {user && <Navigation user={user} onLogout={handleLogout} />}
        
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register onLogin={handleLogin} />}
          />
          
          {user ? (
            <>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:id" element={<ArticleView user={user} />} />
              <Route path="/articles/new" element={<ArticleEditor user={user} />} />
              <Route path="/articles/:id/edit" element={<ArticleEditor user={user} />} />
              <Route path="/events" element={<Events user={user} />} />
              <Route path="/files" element={<Files user={user} />} />
              <Route path="/games" element={<Games user={user} />} />
              {user.role === 'admin' && (
                <Route path="/admin" element={<AdminPanel />} />
              )}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;