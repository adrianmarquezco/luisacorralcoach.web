FROM nginx:1.30-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN nginx -t
COPY . /usr/share/nginx/html
RUN rm -f /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/nginx.conf \
    /usr/share/nginx/html/package.json \
    /usr/share/nginx/html/package-lock.json \
    && rm -rf /usr/share/nginx/html/scripts \
    /usr/share/nginx/html/node_modules
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://localhost/ || exit 1
