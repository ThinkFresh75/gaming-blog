# Игровой блог для друзей

Полнофункциональное веб-приложение для ведения игрового блога с системой авторизации, управлением статьями, календарем событий и хранилищем файлов.

## Возможности

- ✅ Регистрация и авторизация пользователей
- ✅ Роли пользователей (User, Moderator, Admin)
- ✅ Админ-панель для управления
- ✅ Создание и редактирование статей с расширенным редактором
- ✅ Календарь событий с участниками
- ✅ Хранилище файлов
- ✅ Система тегов
- ✅ Страницы игр со статьями
- ✅ PostgreSQL база данных

## Технологический стек

### Backend
- Node.js + Express + TypeScript
- PostgreSQL
- JWT аутентификация
- Bcrypt для хеширования паролей
- Multer для загрузки файлов

### Frontend
- React 18 + TypeScript
- React Router для навигации
- Axios для API запросов
- React Quill для редактора статей
- React Calendar для событий

## Установка

### Вариант 1: Использование Docker (рекомендуется)

1. Клонируйте репозиторий:
```bash
git clone https://github.com/ThinkFresh75/gaming-blog.git
cd gaming-blog
```

2. Запустите с помощью Docker Compose:
```bash
docker-compose up -d
```

3. Приложение будет доступно:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

### Вариант 2: Ручная установка

1. Установите PostgreSQL и создайте базу данных:
```sql
CREATE DATABASE gaming_blog;
```

2. Импортируйте схему:
```bash
psql -U postgres -d gaming_blog -f database/init.sql
```

3. Настройте Backend:
```bash
cd backend
npm install
cp .env.example .env
# Отредактируйте .env с вашими настройками
npm run dev
```

4. Настройте Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Конфигурация

### Backend (.env)
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/gaming_blog
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Авторизация
- POST `/api/auth/register` - Регистрация
- POST `/api/auth/login` - Вход
- GET `/api/auth/profile` - Профиль пользователя

### Статьи
- GET `/api/articles` - Список статей
- GET `/api/articles/:id` - Одна статья
- POST `/api/articles` - Создать статью
- PUT `/api/articles/:id` - Обновить статью
- DELETE `/api/articles/:id` - Удалить статью

### События
- GET `/api/events` - Список событий
- POST `/api/events` - Создать событие
- POST `/api/events/:id/join` - Присоединиться
- DELETE `/api/events/:id/leave` - Покинуть

### Файлы
- GET `/api/files` - Список файлов
- POST `/api/files` - Загрузить файл
- DELETE `/api/files/:id` - Удалить файл

### Игры
- GET `/api/games` - Список игр
- GET `/api/games/:id` - Одна игра
- POST `/api/games` - Создать игру (admin/moderator)
- PUT `/api/games/:id` - Обновить игру (admin/moderator)

### Админ панель
- GET `/api/admin/users` - Список пользователей
- PUT `/api/admin/users/:id/role` - Изменить роль
- GET `/api/admin/statistics` - Статистика

## Роли пользователей

- **User**: Может создавать статьи и события, загружать файлы
- **Moderator**: + Может создавать и редактировать игры
- **Admin**: + Полный доступ к админ-панели, управление пользователями

## Деплой на хостинг

### Heroku
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:mini
git push heroku main
```

### Vercel (Frontend) + Railway (Backend)
1. Frontend: Подключите GitHub репозиторий к Vercel
2. Backend: Деплой на Railway с PostgreSQL addon

### VPS (Ubuntu)
```bash
# Установите Node.js, PostgreSQL, Nginx
sudo apt update
sudo apt install nodejs npm postgresql nginx

# Настройте Nginx как reverse proxy
# Используйте PM2 для запуска приложения
npm install -g pm2
pm2 start dist/server.js --name gaming-blog
```

## Первый администратор

При инициализации базы данных создается первый админ:
- Email: admin@example.com
- Пароль: admin123

**ВАЖНО**: Измените пароль после первого входа!

## Лицензия

MIT

## Поддержка

Если у вас возникли вопросы, создайте issue в GitHub репозитории.