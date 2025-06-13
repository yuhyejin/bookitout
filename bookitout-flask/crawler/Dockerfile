FROM python:3.11-slim

# 1. 필수 패키지 설치
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    gnupg \
    unzip \
    fonts-liberation \
    libnss3 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libdrm2 \
    libgbm1 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libxshmfence1 \
    libgtk-3-0 \
    chromium-driver \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# 2. 파이썬 패키지 설치
WORKDIR /app
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# 3. 소스 복사
COPY . .

# 4. 크롬 바이너리 경로 명시 (선택)
ENV CHROME_BIN=/usr/bin/chromium
ENV CHROMEDRIVER_BIN=/usr/bin/chromedriver

# 5. 실행
CMD ["python", "app.py"]
