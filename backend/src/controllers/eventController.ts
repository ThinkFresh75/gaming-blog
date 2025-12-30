import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT e.*, u.nickname as creator_name,
             json_agg(json_build_object('id', eu.user_id, 'nickname', u2.nickname)) as participants
      FROM events e
      LEFT JOIN users u ON e.creator_id = u.id
      LEFT JOIN event_participants eu ON e.id = eu.event_id
      LEFT JOIN users u2 ON eu.user_id = u2.id
      GROUP BY e.id, u.nickname
      ORDER BY e.event_date ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  const { title, description, event_date, event_type } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO events (title, description, event_date, event_type, creator_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, event_date, event_type, req.user!.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const joinEvent = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query(
      'INSERT INTO event_participants (event_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [id, req.user!.id]
    );

    res.json({ message: 'Вы присоединились к событию' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const leaveEvent = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query(
      'DELETE FROM event_participants WHERE event_id = $1 AND user_id = $2',
      [id, req.user!.id]
    );

    res.json({ message: 'Вы покинули событие' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};