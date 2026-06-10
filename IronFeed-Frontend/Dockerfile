FROM node:22-alpine AS build

WORKDIR /workspace

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=4000

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /workspace/dist/IronFeed-Frontend ./dist/IronFeed-Frontend

EXPOSE 4000

CMD ["node", "dist/IronFeed-Frontend/server/server.mjs"]
