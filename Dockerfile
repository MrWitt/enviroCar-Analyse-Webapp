FROM nginx:mainline-alpine

MAINTAINER e.h.juerrens@52north.org

COPY docker_root-redirect_index.html /usr/share/nginx/html/index.html
COPY index.html LICENSE.md /usr/share/nginx/html/stats4poi/
COPY js /usr/share/nginx/html/stats4poi/js/
COPY loader /usr/share/nginx/html/stats4poi/loader/
COPY css /usr/share/nginx/html/stats4poi/css/

EXPOSE 80
