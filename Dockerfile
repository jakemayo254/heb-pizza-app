FROM node:20 AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist/heb-pizza-app/browser .

# docker build -t heb-pizza-app .
# docker run -p 8080:80 heb-pizza-app
# http://localhost:8080

# -p = port mapping
# -t = tag name = heb-pizza-app
# . = use the current directory as the build context
