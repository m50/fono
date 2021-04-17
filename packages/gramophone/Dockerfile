FROM node:15-alpine AS base
WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
COPY ./packages ./packages

FROM base AS build
RUN yarn g install --frozen-lockfile 2>/dev/null
RUN yarn g build:prod

FROM base AS install
ENV NODE_ENV=production
WORKDIR /app
RUN yarn g install --frozen-lockfile 2>/dev/null

FROM node:15-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ./packages/gramophone/package.json ./
COPY --from=install /app/node_modules ./
COPY --from=build /app/packages/gramophone/dist ./
EXPOSE 3000
CMD [ "node", "index.js" ]
