FROM node:15-alpine AS base
WORKDIR /app
COPY package.json yarn.lock ./
COPY ./gramophone ./gramophone
COPY ./horn ./horn
COPY ./record ./record

FROM base AS build

RUN yarn workspace @fono/record install --frozen-lockfile \
    && yarn --cwd=record build

FROM base AS install
ENV NODE_ENV=production

RUN yarn workspace @fono/record install --frozen-lockfile

FROM node:15-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/record/.next ./.next
COPY --from=install /app/node_modules ./node_modules
COPY record/public/ record/src/ record/package.json ./
EXPOSE 3000
CMD [ "yarn", "start" ]
