FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

# Команда для запуску додатку
CMD ["npm", "start"]
