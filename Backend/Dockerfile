# Use the official Node.js LTS Slim base image
# LTS receives more frequent security updates than specific versions.
FROM node:lts-slim

# Set the working directory inside the container
# This is the directory where our application code will live.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
# Docker builds images layer-by-layer. If package.json doesn't change,
# Docker will reuse the cached dependencies layer, making subsequent builds extremely fast.
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the port the app runs on (matching our PORT configuration)
EXPOSE 3000

# Start the application using npm start
CMD ["npm", "start"]
