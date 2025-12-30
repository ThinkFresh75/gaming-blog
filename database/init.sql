-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица игр
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица статей
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    game_id INTEGER REFERENCES games(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица тегов
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Связь статей и тегов
CREATE TABLE article_tags (
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- Таблица событий
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    event_type VARCHAR(50) DEFAULT 'game' CHECK (event_type IN ('game', 'movie', 'other')),
    creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Участники событий
CREATE TABLE event_participants (
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, user_id)
);

-- Таблица файлов
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    path VARCHAR(500) NOT NULL,
    size INTEGER NOT NULL,
    mimetype VARCHAR(100) NOT NULL,
    uploader_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_game ON articles(game_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_files_uploader ON files(uploader_id);

-- Создание первого админа (пароль: admin123)
INSERT INTO users (nickname, email, password, role) 
VALUES ('admin', 'admin@example.com', '$2b$10$xQjWPE9bCVqVp8jL0HW3/.yJYd8FjkGZ5D2EyWHmFQJYQJQ7xJvPm', 'admin');