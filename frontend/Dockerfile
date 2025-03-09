# --- Base Node Image ---
    FROM node:20-alpine as base

    WORKDIR /app
    
    # --- Development Stage ---
    FROM base as development
    
    # Install dependencies
    COPY package*.json ./
    # --- Limpeza ANTES de instalar ---
    RUN rm -rf node_modules package-lock.json
    RUN npm install
    # --- Reinstala o rollup localmente ---
    RUN npm uninstall rollup --save-dev
    RUN npm install rollup --save-dev
    # --------------------------------------
    
    COPY . .
    EXPOSE 3000
    CMD ["npm", "run", "dev"]
    
    
   