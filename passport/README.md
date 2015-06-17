from: https://www.youtube.com/watch?v=twav6O53zIQ

TODO: create a function to only get one record (mongoFindOne).
TODO: make sure user name is unuque

set npm proxy: npm config set proxy http://172.17.42.1:3128/
set proxy in bash: http_proxy=http://172.17.42.1:3128

# start squid:
docker run -d \
         -v $(pwd)/../squid/squid.conf:/etc/squid3/squid.conf \
         -v $(pwd)/../squid/cachedir:/cachedir \
         -v $(pwd)/../squid/log:/var/log/squid3/ \
         -v $(pwd)/../squid/run.sh:/root/run.sh \
         --name squid \
         --net host \
         squid:2015-05 \
         bash /root/run.sh
# start mongodb:
docker run -d \
         -v $(pwd)/../mongodb/log:/var/log/mongodb/ \
         -v $(pwd)/../mongodb/db:/data/db \
         -v $(pwd)/../mongodb/mongod.conf:/etc/mongod.conf \
         -p 27017:27017 \
         --name mongodb \
         mongodb:dev mongod
# start redis:
        docker run -d \
         -v $(pwd)/../redis/log:/var/log/redis \
         -v $(pwd)/../redis/db:/data/db \
         -v $(pwd)/../redis/redis.conf:/etc/redis/redis.conf \
         -p 6379:6379 \
         --name redis \
         redis:dev redis-server
# start orion ide
        docker run -d \
         -v ~/orion:/orion \
         -v $(pwd)/app:/orion/serverworkspace/am/amsterdamharu/OrionContent/test \
         -w /orion \
         -u 1000 \
         -p 9999:9999 \
         --name orion \
         orion:dev \
         eclipse/orion

# start node:
docker run -it --rm \
         -v $(pwd)/app:/app \
         -w /app \
         -p 80:80 \
         -p 8080:8080 \
         -p 5858:5858 \
         --name passport \
         node:dev bash


start mongodb-express
        docker run -it --rm \
         -v $(pwd)/../mongodb-express/app:/app \
         -v $(pwd)/../mongodb-express/config.js:/app/config.js \
         -w /app \
         -p 8888:80 \
         --name mongo-express \
         node:dev
