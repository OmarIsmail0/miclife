FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx dist/ /usr/share/nginx/html/

RUN test -f /usr/share/nginx/html/index.html

USER nginx

EXPOSE 8080
