# ---- base ----
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# ---- build ----
FROM base AS build
COPY . .
RUN npm run build

# ---- final ----
FROM nginx:1.27-alpine AS final

# Run nginx as non-root
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup && \
    chown -R appuser:appgroup /var/cache/nginx /var/run /var/log/nginx && \
    touch /tmp/nginx.pid && chown appuser:appgroup /tmp/nginx.pid

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Write pid to /tmp so non-root nginx can write it
RUN sed -i 's|/var/run/nginx.pid|/tmp/nginx.pid|g' /etc/nginx/nginx.conf

USER appuser
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
