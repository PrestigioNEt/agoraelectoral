# Base image
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm cache clean --force
RUN npm install

# Bundle app source
COPY . .

# Expose port and start app
EXPOSE 5173
CMD [ "npm", "run", "dev" ]