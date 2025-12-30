FROM node:20-alpine

WORKDIR /app

# Устанавливаем зависимости отдельно для кеширования слоя
COPY package*.json ./

# Используем npm ci для более быстрой установки и --verbose для отслеживания
RUN npm ci --only=production --verbose || npm install --verbose

# Копируем остальные файлы
COPY . .

# Создаем директорию для загрузок
RUN mkdir -p uploads

EXPOSE 5000

CMD ["npm", "run", "dev"]