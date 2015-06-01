Docker mongodb dev
==================

This is a container running mongodb and is available on port 27017

Database in in ./db, the logs are in ./log and the config is in mongod.conf

Installing
----------

Go to the build directory and run:

        docker build -t mongodb:dev .

When the image is created you need to do some setup.

        docker run -it --rm \
         -v $(pwd)/log:/var/log/mongodb/ \
         -v $(pwd)/db:/data/db \
         -v $(pwd)/mongod.conf:/etc/mongod.conf \
         mongodb:dev bash

In the container run the following command (replace 'hello_world with the password of our choosing'):

        mongod &
        # wait untill mongod has started saying listening to port 27017 and press control + c
        #   now you can execute the database setup (admin user and password)
        MONGO_PASSWORD='hello_world' && \
        mongo localhost --eval "db.createUser({user: 'admin', pwd: '$MONGO_PASSWORD', roles:[{role:'root',db:'admin'}]});" && \
        mongo localhost --eval "db.shutdownServer();"

Run the container
-----------------

In the current directory (not in build) run the following command:

        docker run -it --rm \
         -v $(pwd)/log:/var/log/mongodb/ \
         -v $(pwd)/db:/data/db \
         -v $(pwd)/mongod.conf:/etc/mongod.conf \
         -p 27017:27017 \
         --name mongodb \
         mongodb:dev mongod
