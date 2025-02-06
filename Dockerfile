FROM node:22.13.1-alpine

WORKDIR /app
COPY package.json ./package.json
RUN npm install

COPY . .
CMD ["npm", "start"]
