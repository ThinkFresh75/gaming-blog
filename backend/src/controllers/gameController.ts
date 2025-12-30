import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getGames = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT g.*, COUNT(a.id) as articles_count
      FROM games g
      LEFT JOIN articles a ON g.id = a.game_id
      GROUP BY g.id
      ORDER BY g.title ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const getGame = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM games WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Игра не найдена' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const createGame = async (req: AuthRequest, res: Response) => {
  const { title, description, cover_image } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO games (title, description, cover_image) VALUES ($1, $2, $3) RETURNING *',
      [title, description, cover_image || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const updateGame = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, cover_image } = req.body;

  try {
    const result = await pool.query(
      'UPDATE games SET title = $1, description = $2, cover_image = $3 WHERE id = $4 RETURNING *',
      [title, description, cover_image, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Игра не найдена' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};