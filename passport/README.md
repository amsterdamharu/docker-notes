from: https://www.youtube.com/watch?v=twav6O53zIQ

TODO: figure out the idea behind serialize and desirialize
TODO: get user from mongodb and save session in redis

start squid:
docker run -d \
         -v $(pwd)/../squid/squid.conf:/etc/squid3/squid.conf \
         -v $(pwd)/../squid/cachedir:/cachedir \
         -v $(pwd)/../squid/log:/var/log/squid3/ \
         -v $(pwd)/../squid/run.sh:/root/run.sh \
         --name squid \
         --net host \
         squid:2015-05 \
         bash /root/run.sh

start node:
docker run -it --rm \
         -v $(pwd)/app:/app \
         -w /app \
         -p 80:80 \
         -p 8080:8080 \
         -p 5858:5858 \
         --name passport \
         node:dev bash


start mongodb:
docker run -d \
         -v $(pwd)/../mongodb/log:/var/log/mongodb/ \
         -v $(pwd)/../mongodb/db:/data/db \
         -v $(pwd)/../mongodb/mongod.conf:/etc/mongod.conf \
         -p 27017:27017 \
         --name mongodb \
         mongodb:dev mongod
