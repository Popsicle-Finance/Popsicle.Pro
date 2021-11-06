FROM node:14.15 as node-modules-manager
WORKDIR /app
COPY ./ /app/
RUN yarn install
RUN yarn build

FROM nginx:latest
WORKDIR /app
COPY --from=node-modules-manager --chown=www-data:www-data /app/dist/ /app/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
