FROM nginx:alpine

MAINTAINER e.h.juerrens@52north.org

COPY index.html LICENSE.md /usr/share/nginx/html/
COPY js /usr/share/nginx/html/js/
COPY loader /usr/share/nginx/html/loader/
COPY css /usr/share/nginx/html/css/

EXPOSE 80
