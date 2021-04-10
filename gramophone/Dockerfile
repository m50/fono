FROM node:15-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
COPY ./gramophone ./gramophone
COPY ./horn ./horn
COPY ./record ./record
RUN yarn workspace @fono/gramophone install --frozen-lockfile \
    && yarn --cwd=gramophone build

FROM node:15-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/gramophone/dist/index.js ./dist
EXPOSE 3001 17333
RUN ls && ls dist
CMD [ "yarn", "start" ]
