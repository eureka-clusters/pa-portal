FROM node:26-alpine AS builder

ENV NODE_ENV=production
ENV REACT_APP_SERVER_URI='https://api.eurekaclusters.eu'

# Add a work directory
WORKDIR /app

# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .

RUN npm install -g corepack && corepack enable && corepack prepare yarn@4.14.1 --activate

# Copy app files
COPY . .

RUN yarn install

# Build the app
RUN yarn build

# Bundle static assets with nginx
FROM nginx:alpine AS production

LABEL maintainer="johan.van.der.heide@itea4.org"
LABEL org.opencontainers.image.source="https://github.com/eureka-clusters/portal-backend";

ENV NODE_ENV=production

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Add your nginx.conf
COPY .docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
