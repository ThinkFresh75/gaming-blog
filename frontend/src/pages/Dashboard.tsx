import React from 'react';

interface DashboardProps {
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="container">
      <h1>Добро пожаловать, {user.nickname}!</h1>
      <div className="card">
        <h2>Главная панель</h2>
        <p>Здесь будет отображаться общая информация о блоге.</p>
        <ul>
          <li>Последние статьи</li>
          <li>Предстоящие события</li>
          <li>Статистика блога</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;