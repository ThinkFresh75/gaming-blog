import React, { useEffect, useState } from 'react';
import { filesAPI } from '../services/api';

interface FilesProps {
  user: any;
}

const Files: React.FC<FilesProps> = ({ user }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await filesAPI.getAll();
      setFiles(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await filesAPI.upload(file);
      loadFiles();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Удалить файл?')) {
      try {
        await filesAPI.delete(id);
        loadFiles();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div className="container">Загрузка...</div>;

  return (
    <div className="container">
      <h1>Хранилище файлов</h1>

      <div className="card">
        <h2>Загрузить файл</h2>
        <input
          type="file"
          onChange={handleUpload}
          disabled={uploading}
          style={{ marginTop: '1rem' }}
        />
        {uploading && <p>Загрузка...</p>}
      </div>

      {files.length === 0 ? (
        <div className="card">Файлов пока нет</div>
      ) : (
        files.map(file => (
          <div key={file.id} className="card">
            <h3>{file.original_name}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Загружен: {file.uploader_name} | {new Date(file.uploaded_at).toLocaleDateString('ru-RU')} |
              Размер: {(file.size / 1024).toFixed(2)} KB
            </p>
            {(user.id === file.uploader_id || user.role === 'admin') && (
              <button onClick={() => handleDelete(file.id)} className="btn btn-danger" style={{ marginTop: '0.5rem' }}>
                Удалить
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Files;