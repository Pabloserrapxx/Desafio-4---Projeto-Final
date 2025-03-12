# --- Base Node Image ---
    FROM node:20-alpine as base

    WORKDIR /app
    
    # --- Development Stage ---
    FROM base as development
    
    COPY package*.json ./
    
  
    RUN npm install @mui/material @emotion/react @emotion/styled @mui/icons-material \
        && npm cache clean --force \
        && rm -rf node_modules package-lock.json \
        && npm install
    
     RUN npm uninstall rollup --save-dev
     RUN npm install rollup --save-dev
    
    # Copia o restante do código
    COPY . .
    
    EXPOSE 3000
    CMD ["npm", "run", "dev"]