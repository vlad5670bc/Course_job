# Вказуємо базовий образ Node.js
FROM node:18

# Встановлюємо робочу директорію всередині контейнера
WORKDIR /app

# Копіюємо package.json та package-lock.json для встановлення залежностей
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь проект у робочу директорію
COPY . .

# Збираємо додаток
RUN npm run build

# Встановлюємо базовий образ для сервера
FROM nginx:stable-alpine

# Копіюємо зібраний додаток до папки, яку буде обслуговувати nginx
COPY --from=0 /app/build /usr/share/nginx/html

# Експонуємо порт
EXPOSE 80

# Запускаємо nginx
CMD ["nginx", "-g", "daemon off;"]
