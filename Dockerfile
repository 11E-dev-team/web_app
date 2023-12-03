# Use an official Node.js runtime as the base image
FROM node:latest as build-stage

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the entire app directory to the working directory
COPY . .

# Build the Vue app for production
RUN npm run build

CMD ["npm", "run", "serve"]
