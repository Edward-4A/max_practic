FROM node:22-alpine

WORKDIR /app
COPY js_tasks/package.json .
RUN npm install

COPY index.html .
COPY fonts/ .
COPY js_tasks/ js_tasks
COPY layout/ layout/

RUN npm install -g serve

EXPOSE 8080 3000

CMD ["sh", "-c", "node js_tasks/proxy.js & serve -l 8080"]