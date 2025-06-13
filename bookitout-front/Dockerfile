# Build 단계
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

# NPM 캐시 초기화 및 중국 미러 사용
RUN npm config set registry https://registry.npmmirror.com
RUN npm cache clean --force && npm install

# 소스 복사 및 빌드
COPY . ./
RUN npm run build

# Serve 단계
FROM nginx:stable-alpine

# default.conf 삭제 (기본 root가 /etc/nginx/html이라서 오류 유발)
RUN rm /etc/nginx/conf.d/default.conf

# 빌드된 정적 파일 복사
COPY --from=builder /app/build /usr/share/nginx/html

# custom nginx.conf 덮어쓰기
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
