FROM ubuntu:14.04

# start the squid container from squid first
# 
ENV http_proxy=http://172.17.42.1:3128/
ENV ftp_proxy=http://172.17.42.1:3128/
ENV all_proxy=socks://172.17.42.1:3128/
ENV https_proxy=http://172.17.42.1:3128/
ENV no_proxy=localhost,127.0.0.0/8,::1

ADD ./ /build

WORKDIR /build

RUN \
    apt-get update && \
    dpkg -i rabbitmq-server_3.5.3-1_all.deb; exit 0
    
RUN \
    apt-get install -f -y && \
    apt-get clean


