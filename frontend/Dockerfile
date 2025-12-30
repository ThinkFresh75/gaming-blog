FROM node:20-alpine

WORKDIR /app

# Устанавливаем зависимости отдельно для кеширования слоя
COPY package*.json ./

# Используем npm ci для более быстрой установки
RUN npm ci --verbose || npm install --verbose

# Копируем остальные файлы
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]