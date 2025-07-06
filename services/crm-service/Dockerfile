# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build typescript
RUN npm run build

# Expose port and start app
EXPOSE 3002
CMD [ "npm", "start" ]
