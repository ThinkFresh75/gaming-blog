import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

interface NavigationProps {
  user: any;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🎮 Игровой Блог
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/articles" className="nav-link">Статьи</Link>
          <Link to="/games" className="nav-link">Игры</Link>
          <Link to="/events" className="nav-link">События</Link>
          <Link to="/files" className="nav-link">Файлы</Link>
          {user.role === 'admin' && (
            <Link to="/admin" className="nav-link">Админ</Link>
          )}
        </div>
        
        <div className="nav-user">
          <span className="username">{user.nickname}</span>
          <button onClick={onLogout} className="btn-logout">Выход</button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;