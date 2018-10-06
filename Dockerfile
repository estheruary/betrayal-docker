# Dockerfile

FROM node

COPY app /app

RUN npm install -g uglify-js uglifycss \
  && $(npm -g bin)/uglifyjs /app/app.js -cmo /app/app.min.js \
  && $(npm -g bin)/uglifycss /app/app.css --output /app/app.min.css

FROM nginx

COPY app /usr/share/nginx/html
ADD https://code.jquery.com/jquery-1.7.1.min.js /usr/share/nginx/html/
COPY --from=0 /app/app.min.js /usr/share/nginx/html/
COPY --from=0 /app/app.min.css /usr/share/nginx/html/
RUN chown nginx:nginx -R /usr/share/nginx/html
