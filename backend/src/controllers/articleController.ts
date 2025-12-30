import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getArticles = async (req: AuthRequest, res: Response) => {
  const { game_id, tag } = req.query;

  try {
    let query = `
      SELECT a.*, u.nickname as author_name, 
             array_agg(DISTINCT t.name) as tags,
             g.title as game_title
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN article_tags at ON a.id = at.article_id
      LEFT JOIN tags t ON at.tag_id = t.id
      LEFT JOIN games g ON a.game_id = g.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 1;

    if (game_id) {
      query += ` AND a.game_id = $${paramCount}`;
      params.push(game_id);
      paramCount++;
    }

    if (tag) {
      query += ` AND EXISTS (
        SELECT 1 FROM article_tags at2 
        JOIN tags t2 ON at2.tag_id = t2.id 
        WHERE at2.article_id = a.id AND t2.name = $${paramCount}
      )`;
      params.push(tag);
    }

    query += ' GROUP BY a.id, u.nickname, g.title ORDER BY a.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const getArticle = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT a.*, u.nickname as author_name,
             array_agg(DISTINCT t.name) as tags,
             g.title as game_title
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN article_tags at ON a.id = at.article_id
      LEFT JOIN tags t ON at.tag_id = t.id
      LEFT JOIN games g ON a.game_id = g.id
      WHERE a.id = $1
      GROUP BY a.id, u.nickname, g.title
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const createArticle = async (req: AuthRequest, res: Response) => {
  const { title, content, game_id, tags } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO articles (title, content, author_id, game_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, req.user!.id, game_id || null]
    );

    const article = result.rows[0];

    // Добавление тегов
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        let tagResult = await pool.query('SELECT id FROM tags WHERE name = $1', [tagName]);
        
        if (tagResult.rows.length === 0) {
          tagResult = await pool.query('INSERT INTO tags (name) VALUES ($1) RETURNING id', [tagName]);
        }

        const tagId = tagResult.rows[0].id;
        await pool.query('INSERT INTO article_tags (article_id, tag_id) VALUES ($1, $2)', [article.id, tagId]);
      }
    }

    res.status(201).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const updateArticle = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, content, game_id, tags } = req.body;

  try {
    // Проверка прав
    const checkResult = await pool.query('SELECT author_id FROM articles WHERE id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    if (checkResult.rows[0].author_id !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав на редактирование' });
    }

    const result = await pool.query(
      'UPDATE articles SET title = $1, content = $2, game_id = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [title, content, game_id || null, id]
    );

    // Обновление тегов
    if (tags) {
      await pool.query('DELETE FROM article_tags WHERE article_id = $1', [id]);
      
      for (const tagName of tags) {
        let tagResult = await pool.query('SELECT id FROM tags WHERE name = $1', [tagName]);
        
        if (tagResult.rows.length === 0) {
          tagResult = await pool.query('INSERT INTO tags (name) VALUES ($1) RETURNING id', [tagName]);
        }

        const tagId = tagResult.rows[0].id;
        await pool.query('INSERT INTO article_tags (article_id, tag_id) VALUES ($1, $2)', [id, tagId]);
      }
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const checkResult = await pool.query('SELECT author_id FROM articles WHERE id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    if (checkResult.rows[0].author_id !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав на удаление' });
    }

    await pool.query('DELETE FROM articles WHERE id = $1', [id]);
    res.json({ message: 'Статья удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};