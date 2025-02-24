# Stage 1: Build React app
FROM node:16-alpine as build
WORKDIR /app
COPY package.json package-lock.json* ./
# Copy .env file so that REACT_APP_API_BASE_URL and others are available at build time
COPY .env ./
RUN npm install
COPY . .
# Increase Node memory limit to 4GB
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN CI=false npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html
COPY public/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]