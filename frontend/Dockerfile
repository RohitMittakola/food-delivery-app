# Use a lightweight Node.js environment
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the React code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Run Vite and expose the host so it can be accessed from outside the container
CMD ["npm", "run", "dev", "--", "--host"]