import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, nickname, email, role, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'moderator', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Недопустимая роль' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, nickname, email, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const getStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const articlesCount = await pool.query('SELECT COUNT(*) FROM articles');
    const eventsCount = await pool.query('SELECT COUNT(*) FROM events');
    const gamesCount = await pool.query('SELECT COUNT(*) FROM games');

    res.json({
      users: parseInt(usersCount.rows[0].count),
      articles: parseInt(articlesCount.rows[0].count),
      events: parseInt(eventsCount.rows[0].count),
      games: parseInt(gamesCount.rows[0].count)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};