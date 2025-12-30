import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getStatistics()
      ]);
      setUsers(usersRes.data);
      setStatistics(statsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="container">Загрузка...</div>;

  return (
    <div className="container">
      <h1>Администрирование</h1>

      {statistics && (
        <div className="card">
          <h2>Статистика</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <h3>{statistics.users}</h3>
              <p>Пользователей</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3>{statistics.articles}</h3>
              <p>Статей</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3>{statistics.games}</h3>
              <p>Игр</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3>{statistics.events}</h3>
              <p>Событий</p>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Управление пользователями</h2>
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Никнейм</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Роль</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{user.id}</td>
                <td style={{ padding: '0.5rem' }}>{user.nickname}</td>
                <td style={{ padding: '0.5rem' }}>{user.email}</td>
                <td style={{ padding: '0.5rem' }}>{user.role}</td>
                <td style={{ padding: '0.5rem' }}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    style={{ padding: '0.25rem' }}
                  >
                    <option value="user">Пользователь</option>
                    <option value="moderator">Модератор</option>
                    <option value="admin">Админ</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;