import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articlesAPI } from '../services/api';

interface ArticleViewProps {
  user: any;
}

const ArticleView: React.FC<ArticleViewProps> = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      const response = await articlesAPI.getOne(Number(id));
      setArticle(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Удалить статью?')) {
      try {
        await articlesAPI.delete(Number(id));
        navigate('/articles');
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div className="container">Загрузка...</div>;
  if (!article) return <div className="container">Статья не найдена</div>;

  const canEdit = user.id === article.author_id || user.role === 'admin';

  return (
    <div className="container">
      <div className="card">
        <h1>{article.title}</h1>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Автор: {article.author_name} | {new Date(article.created_at).toLocaleDateString('ru-RU')}
        </p>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
        
        {canEdit && (
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <Link to={`/articles/${id}/edit`} className="btn btn-primary">Редактировать</Link>
            <button onClick={handleDelete} className="btn btn-danger">Удалить</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleView;