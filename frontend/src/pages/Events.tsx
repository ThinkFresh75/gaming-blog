import React, { useEffect, useState } from 'react';
import { eventsAPI } from '../services/api';

interface EventsProps {
  user: any;
}

const Events: React.FC<EventsProps> = ({ user }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_type: 'game'
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await eventsAPI.create(formData);
      setFormData({ title: '', description: '', event_date: '', event_type: 'game' });
      setShowForm(false);
      loadEvents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoin = async (id: number) => {
    try {
      await eventsAPI.join(id);
      loadEvents();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="container">Загрузка...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>События</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {сhowForm ? 'Отмена' : 'Создать событие'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2>Новое событие</h2>
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
                rows={3}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Дата и время</label>
              <input
                type="datetime-local"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Тип</label>
              <select
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                style={{ width: '100%', padding: '0.5rem' }}
              >
                <option value="game">Игра</option>
                <option value="movie">Кино</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Создать</button>
          </form>
        </div>
      )}

      {events.length === 0 ? (
        <div className="card">Событий пока нет</div>
      ) : (
        events.map(event => (
          <div key={event.id} className="card">
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              📅 {new Date(event.event_date).toLocaleString('ru-RU')} | 
              🎮 {event.event_type === 'game' ? 'Игра' : event.event_type === 'movie' ? 'Кино' : 'Другое'}
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Участники: {event.participants?.filter((p: any) => p.id).length || 0}
            </p>
            <button onClick={() => handleJoin(event.id)} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Присоединиться
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Events;