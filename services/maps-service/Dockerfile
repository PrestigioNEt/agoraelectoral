# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
COPY package*.json ./

RUN npm install

# Copy app source code
COPY . .

# Expose port
EXPOSE 3000

# Run the application
CMD [ "node", "src/index.js" ]
