FROM nginx:1.19-alpine

# RUN mkdir -p /run/nginx
COPY /src/client /usr/share/nginx/html
COPY /conf.d/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
