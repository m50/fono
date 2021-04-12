FROM node:15-alpine AS base
WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
COPY ./gramophone ./gramophone
COPY ./horn ./horn
COPY ./record ./record

FROM base AS build
RUN yarn g install --frozen-lockfile 2>/dev/null
RUN yarn g build

FROM base AS install
ENV NODE_ENV=production
WORKDIR /app
RUN yarn g install --frozen-lockfile 2>/dev/null

FROM node:15-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ./gramophone/package.json ./gramophone/yarn.lock ./
COPY --from=install /app/node_modules ./
COPY --from=build /app/gramophone/dist ./
EXPOSE 3000
CMD [ "node", "index.js" ]
