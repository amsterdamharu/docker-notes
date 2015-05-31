FROM ubuntu:14.04

#set the squid proxy that refers to the astrill proxy running on the host
ENV http_proxy=http://172.17.42.1:3128/
ENV ftp_proxy=http://172.17.42.1:3128/
ENV all_proxy=socks://172.17.42.1:3128/
ENV https_proxy=http://172.17.42.1:3128/
ENV no_proxy=localhost,127.0.0.0/8,::1

# install squid and clean up apt cache
RUN apt-get -q update && apt-get -qy install squid && sudo apt-get clean

