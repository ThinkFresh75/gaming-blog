import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

export const uploadFile = async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Файл не загружен' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO files (filename, original_name, path, size, mimetype, uploader_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.file.filename, req.file.originalname, req.file.path, req.file.size, req.file.mimetype, req.user!.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const getFiles = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT f.*, u.nickname as uploader_name
      FROM files f
      LEFT JOIN users u ON f.uploader_id = u.id
      ORDER BY f.uploaded_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const deleteFile = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const fileResult = await pool.query('SELECT * FROM files WHERE id = $1', [id]);
    
    if (fileResult.rows.length === 0) {
      return res.status(404).json({ message: 'Файл не найден' });
    }

    const file = fileResult.rows[0];

    if (file.uploader_id !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав на удаление' });
    }

    // Удаление физического файла
    fs.unlinkSync(path.join(__dirname, '../../', file.path));

    await pool.query('DELETE FROM files WHERE id = $1', [id]);
    res.json({ message: 'Файл удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};