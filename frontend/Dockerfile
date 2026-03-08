FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

ENV VITE_API_URL=http://localhost:8000/api

CMD ["npm", "run", "dev"]
