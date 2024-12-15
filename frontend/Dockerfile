# Step 1: Build the frontend
FROM node:latest AS build

# Set the working directory for the frontend
WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copy the source code
COPY frontend/ ./

# Build the Next.js app
RUN npm run build

# Step 2: Create a smaller image for serving the app
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the build from the previous stage
COPY --from=build /app ./

# Expose port 3000 for the frontend
EXPOSE 3000

# Command to run the Next.js app
CMD ["npm", "start"]
