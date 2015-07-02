Docker multiple images examples
===============================

This project has examples using rabitmq, mongodb, redis and orion. 
TODO:
- Make db a standalone program that consumes a queue and publishes to a channel
- Make authImplementor publish to a channel instead of calling db directly
- See next: channelToPromise should be a constructor and init will create and return an instance
- Instead of authImplementor publish to a channel have it call channelToPromise. It will publish to a chanel and consume a que. When answer comes it can resolve a promise. (Configurable how many requests it will remember)
- If channelToPromise times out or gets too full it should publish to log with either error or warning messgae
- Figure out why I should close on SIGINT as in the exampe. Not doing this does not show open connections in rabbitmq admin but doing it does not close the application on control + c. Uncought exceptions and kill do not trigger the event either.
- Make pubsub to promise
- Need document the dep manager (initializer.js)
- Have dep data served by server and change initializer.js 
- Need tests (unit and integration)

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
# start rabbitmq
        docker start rabbitmq
        docker exec -d rabbitmq rabbitmq-server

# start node:
        docker run -it --rm \
         -v $(pwd)/app:/app \
         -w /app \
         -p 80:80 \
         -p 8080:8080 \
         -p 5858:5858 \
         --link mongodb:mongodb \
         --link redis:redis \
         --link rabbitmq:rabbitmq \
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
