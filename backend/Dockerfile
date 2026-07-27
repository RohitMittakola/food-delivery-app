# Use a lightweight Node.js environment
FROM node:20
# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port your Express server runs on (change if yours is different)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]