FROM node:15-alpine AS build
WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
COPY ./gramophone ./gramophone
COPY ./horn ./horn
COPY ./record ./record
RUN yarn g install --frozen-lockfile 2>/dev/null
RUN yarn g build

FROM node:15-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/gramophone/dist/index.js ./
EXPOSE 3000
CMD [ "node", "index.js" ]
