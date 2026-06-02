FROM node:22-alpine AS optimize
WORKDIR /site
COPY package.json package-lock.json ./
RUN npm ci
COPY assets ./assets
COPY scripts/optimize-images.mjs ./scripts/optimize-images.mjs
RUN node scripts/optimize-images.mjs

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
COPY --from=optimize /site/assets /usr/share/nginx/html/assets
RUN rm -f /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/nginx.conf \
    /usr/share/nginx/html/package.json \
    /usr/share/nginx/html/package-lock.json \
    && rm -rf /usr/share/nginx/html/scripts \
    /usr/share/nginx/html/node_modules
