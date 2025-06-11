# Build 단계
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./

# 기존 node_modules 및 package-lock.json을 클린업합니다.
# 이렇게 하면 캐시 문제를 방지하고 의존성을 새로 설치할 수 있습니다.
RUN rm -rf node_modules && \
    rm -f package-lock.json && \
    npm cache clean --force

RUN npm install
COPY . ./
RUN npm run build

# Serve 단계
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf