Docker multiple images examples
===============================

This project has examples using rabitmq, mongodb, redis and orion. 
TODO:
- Need document the dep manager
- Have dep data served by server and change 
- Remove db deps from authImplementor
- Need tests (unit and integration)
- Need rabbitmq
- Make pubsub to promise

Installing
----------

No installation required, build all the images with the Dockerfile provided. Images needed are

- mongodb
- redis
- orion (to manage the project)
- rabitmq

Run the container
-----------------

# start mongodb: (removed -p 27017:27017 because app uses --link)
        docker run -d \
         -v $(pwd)/../mongodb/log:/var/log/mongodb/ \
         -v $(pwd)/../mongodb/db:/data/db \
         -v $(pwd)/../mongodb/mongod.conf:/etc/mongod.conf \
         --name mongodb \
         mongodb:dev mongod
# start redis:(removed -p 6379:6379 because app uses --link)
        docker run -d \
         -v $(pwd)/../redis/log:/var/log/redis \
         -v $(pwd)/../redis/db:/data/db \
         -v $(pwd)/../redis/redis.conf:/etc/redis/redis.conf \
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
         -e "MONGODB_HOST=mongodb" \
         -e "MONGODB_PORT=27017" \
         --link mongodb:mongodb \
         -e "REDIS_HOST=redis" \
         --link redis:redis \
         --name app \
         node:dev bash



#start mongodb-express (currently not working, need edit the config.js)
        docker run -it --rm \
         -v $(pwd)/../mongodb-express/app:/app \
         -v $(pwd)/../mongodb-express/config.js:/app/config.js \
         -w /app \
         -p 8888:80 \
         --name mongo-express \
         node:dev
