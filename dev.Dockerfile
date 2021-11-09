# pull official base image
FROM node:16

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json /app

RUN npm install
RUN npm add typescript

#set the ownership of the cache folder
RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

# add app
COPY . /app

# start app
CMD ["npm", "start"]