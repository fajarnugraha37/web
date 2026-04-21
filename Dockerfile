# Stage 1: Build the static site with Bun
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static export output to serve under /web
COPY --from=builder /app/out /usr/share/nginx/html/web

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
