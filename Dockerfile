FROM node:20-slim AS builder

WORKDIR /app
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
# Generate Prisma client during build
RUN npx prisma generate

FROM node:20-slim
WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
# Copy the entire node_modules to ensure all dependencies are available
COPY --from=builder /app/node_modules ./node_modules
# Still copy prisma files for potential migrations or other prisma commands
COPY --from=builder /app/prisma ./prisma

RUN echo '#!/bin/sh\n\
echo "Starting environment check..."\n\
\n\
# Set default PORT if not provided\n\
: "${PORT:=8080}"\n\
\n\
# Check environment variables\n\
for VAR in DATABASE_URL EMAIL PASSWORD APP_URL; do\n\
    if [ -z "$(eval echo \$$VAR)" ]; then\n\
        echo "Error: $VAR is not set"\n\
        exit 1\n\
    fi\n\
done\n\
\n\
echo "Starting application on port $PORT..."\n\
exec npm start' > /app/start.sh

RUN chmod +x /app/start.sh

ENV NODE_ENV=production
EXPOSE 8080

CMD ["/app/start.sh"]