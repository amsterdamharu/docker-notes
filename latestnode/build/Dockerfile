FROM node:dev

# start the squid container from squid first
# 
ENV http_proxy=http://172.17.42.1:3128/
ENV ftp_proxy=http://172.17.42.1:3128/
ENV all_proxy=socks://172.17.42.1:3128/
ENV https_proxy=http://172.17.42.1:3128/
ENV no_proxy=localhost,127.0.0.0/8,::1

# install node
RUN \
    apt-get -q update && \
    apt-get -qy install git && \
    apt-get clean && \
    cd /usr/local/src && \
    mkdir node && \
    cd node && \
    git clone https://github.com/nodejs/node.git . && \
    ./configure && \
    make && \
    make install && \
    cd ../ && \
    rm -rf node && \
    npm config set proxy http://172.17.42.1:3128/ && \
    npm config set https-proxy http://172.17.42.1:3128/
    
CMD ["npm", "start"]
