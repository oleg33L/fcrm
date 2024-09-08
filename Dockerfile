FROM node:20.10.0

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm i -g @nestjs/cli
RUN npm install bcrypt
COPY . .

RUN npm run build

EXPOSE 3000

# Install development dependencies
RUN npm install --only=development
EXPOSE 9229
CMD ["npm", "run", "start:debug"]
