import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI } from '../services/api';

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await articlesAPI.getAll();
      setArticles(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Загрузка...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Статьи</h1>
        <Link to="/articles/new" className="btn btn-primary">Создать статью</Link>
      </div>
      
      {articles.length === 0 ? (
        <div className="card">Статей пока нет</div>
      ) : (
        articles.map(article => (
          <div key={article.id} className="card">
            <h2>
              <Link to={`/articles/${article.id}`} style={{ textDecoration: 'none', color: '#333' }}>
                {article.title}
              </Link>
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Автор: {article.author_name} | {new Date(article.created_at).toLocaleDateString('ru-RU')}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Articles;