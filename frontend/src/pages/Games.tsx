import React, { useEffect, useState } from 'react';
import { gamesAPI } from '../services/api';
import { Link } from 'react-router-dom';

interface GamesProps {
  user: any;
}

const Games: React.FC<GamesProps> = ({ user }) => {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_image: ''
  });

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const response = await gamesAPI.getAll();
      setGames(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await gamesAPI.create(formData);
      setFormData({ title: '', description: '', cover_image: '' });
      setShowForm(false);
      loadGames();
    } catch (error) {
      console.error(error);
    }
  };

  const canCreateGame = user.role === 'admin' || user.role === 'moderator';

  if (loading) return <div className="container">Загрузка...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Игры</h1>
        {canCreateGame && (
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Отмена' : 'Добавить игру'}
          </button>
        )}
      </div>

      {showForm && canCreateGame && (
        <div className="card">
          <h2>Новая игра</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Название</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ width: '100%', padding: '0.5rem' }}
                rows={4}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>URL обложки</label>
              <input
                type="text"
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary">Создать</button>
          </form>
        </div>
      )}

      {games.length === 0 ? (
        <div className="card">Игр пока нет</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {games.map(game => (
            <div key={game.id} className="card">
              {game.cover_image && (
                <img src={game.cover_image} alt={game.title} style={{ width: '100%', borderRadius: '5px', marginBottom: '1rem' }} />
              )}
              <h2>{game.title}</h2>
              <p>{game.description}</p>
              <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '1rem' }}>
                Статей: {game.articles_count || 0}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Games;