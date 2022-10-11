FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm i
EXPOSE 3001
RUN npm run build
CMD ["node", "--inspect", "out/index.js"] 