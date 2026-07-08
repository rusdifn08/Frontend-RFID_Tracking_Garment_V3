FROM node:22-bookworm-slim
RUN apt-get update \
  && apt-get install -y --no-install-recommends tini \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY docker/entrypoint-proxy.sh /entrypoint-proxy.sh
COPY docker/entrypoint-frontend.sh /entrypoint-frontend.sh
RUN chmod +x /entrypoint-proxy.sh /entrypoint-frontend.sh
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN mkdir -p /app/docker-data
EXPOSE 5173 5174 5175 8000 8001 8002
