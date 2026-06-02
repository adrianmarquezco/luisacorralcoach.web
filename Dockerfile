FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
RUN rm -f /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/nginx.conf \
    /usr/share/nginx/html/package.json \
    /usr/share/nginx/html/package-lock.json \
    && rm -rf /usr/share/nginx/html/scripts \
    /usr/share/nginx/html/node_modules
