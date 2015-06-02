FROM ubuntu:14.04

# start the squid container from squid first
# 
ENV http_proxy=http://172.17.42.1:3128/
ENV ftp_proxy=http://172.17.42.1:3128/
ENV all_proxy=socks://172.17.42.1:3128/
ENV https_proxy=http://172.17.42.1:3128/
ENV no_proxy=localhost,127.0.0.0/8,::1

RUN apt-get install -y software-properties-common && \
    add-apt-repository ppa:chris-lea/redis-server && \
    apt-get update && \
    apt-get install -y redis-server && \
    apt-get clean


