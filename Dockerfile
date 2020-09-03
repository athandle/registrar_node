FROM node:12.2.0
RUN mkdir /opt/app-be
RUN mkdir /var/ssl
WORKDIR /opt/app-be
COPY . /opt/app-be
RUN npm install
EXPOSE 443
CMD [ "npm", "run", "start:prod"] 