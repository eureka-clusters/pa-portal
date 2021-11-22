FROM node:16-alpine as build

RUN mkdir /app
WORKDIR /app
ADD . /app

# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn install


FROM node:16-alpine AS development
ENV NODE_ENV development

# Add a work directory
WORKDIR /app

# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn install

# Copy app files
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD [ "yarn", "start" ]

FROM node:14-alpine AS builder
ENV NODE_ENV production

ENV REACT_APP_SERVER_URI $REACT_APP_SERVER_URI
ENV REACT_APP_CLIENT_ID $REACT_APP_CLIENT_ID
ENV REACT_APP_CLIENT_SECRET $REACT_APP_CLIENT_SECRET
ENV REACT_APP_REDIRECT_URI $REACT_APP_REDIRECT_URI

# Add a work directory
WORKDIR /app

# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install --production

# Copy app files
COPY . .

# Build the app
RUN yarn build

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production

LABEL maintainer="johan.van.der.heide@itea4.org"
LABEL org.opencontainers.image.source = "https://github.com/eureka-clusters/portal-backend";

ENV NODE_ENV production

# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Add your nginx.conf
COPY .docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]