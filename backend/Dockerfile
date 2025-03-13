# --- Base Node Image ---
    FROM node:20-alpine as base

    # Set working directory
    WORKDIR /app
    
    # --- Development Stage ---
    FROM base as development
    
    # Install dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy application code
    COPY . .
    
    # Expose port (usually 3000 for React)
    EXPOSE 3000
    
    # Start the development server (using npm run dev)
    CMD ["npm", "run", "dev"]
    
    
    # --- Production Build Stage ---
    FROM base as build
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install --only=production
    
    # --- Corrigindo o problema do rollup ---
    RUN npm uninstall rollup -g
    RUN npm install rollup -g
    # --------------------------------------
    
    COPY . .
    
    # Expose port 80
    EXPOSE 80