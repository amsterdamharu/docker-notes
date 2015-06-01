FROM ubuntu:14.04

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
    apt-get -qy install build-essential openssl libssl-dev pkg-config wget python && \
    apt-get clean && \
    cd /usr/local/src && \
    mkdir node && \
    cd node && \
    wget http://nodejs.org/dist/node-latest.tar.gz && \
    tar xvzf node-latest.tar.gz && \
    rm -f node-latest.tar.gz && \
    cd node-v* && \
    ./configure && \
    make && \
    make install && \
    cd ../../ && \
    rm -rf node && \
    npm install -g --verbose node-inspector grunt && \
    npm cache clear
    
# Set instructions on build if you want to include your code in the image
#  or need npm installed dependencies that cannot be installed by host
ONBUILD ADD package.json /app/
ONBUILD RUN npm install
ONBUILD ADD . /app

CMD ["npm", "start"]
