FROM node:dev

# start the squid container from squid first
# 
ENV http_proxy=http://172.17.42.1:3128/
ENV ftp_proxy=http://172.17.42.1:3128/
ENV all_proxy=socks://172.17.42.1:3128/
ENV https_proxy=http://172.17.42.1:3128/
ENV no_proxy=localhost,127.0.0.0/8,::1
ENV LANG=en_US.UTF-8

# install node
RUN \
    apt-get -q update && \
    apt-get -qy install git && \
    apt-get clean && \
    npm config set proxy http://172.17.42.1:3128/ && \
    npm config set https-proxy http://172.17.42.1:3128/ && \
    npm install -g elm
    
CMD ["npm", "start"]
