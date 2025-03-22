# Set the stage up
FROM node:20 AS builder

WORKDIR /app

# copy data from host into the container
COPY . .

RUN npm install
RUN npm run build

# Nginx = a super lightweight web server. we want the final image small and fast
FROM nginx:alpine

# move to the nginx folder
WORKDIR /usr/share/nginx/html

# copy files from builder stage into the Nginx directory
COPY --from=builder /app/dist/heb-pizza-app/browser .

# docker build -t heb-pizza-app .
# docker run -p 8080:80 heb-pizza-app
# http://localhost:8080

# -p = port mapping
# -t = tag name = heb-pizza-app
# . = use the current directory as the build context
