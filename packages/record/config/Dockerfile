FROM node:15-alpine AS build
WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
COPY ./packages ./packages

RUN yarn r install --frozen-lockfile 2>/dev/null
RUN yarn r build

FROM caddy:2-alpine
WORKDIR /usr/share/caddy
COPY --from=build /app/record/dist ./
RUN printf ":3000\n\nroot * /usr/share/caddy\nfile_server\n" > /etc/caddy/Caddyfile
EXPOSE 3000
