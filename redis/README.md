Docker redis dev
================

This is a container running redis and is available on port 6379

Database in in ./db, the logs are in ./log and the config is in redis.conf

Installing
----------

Go to the build directory and run:

        docker build -t redis:dev .

Run the container
-----------------

In the current directory (not in build) run the following command:

        docker run -it --rm \
         -v $(pwd)/log:/var/log/redis \
         -v $(pwd)/db:/data/db \
         -v $(pwd)/redis.conf:/etc/redis/redis.conf \
         -p 6379:6379 \
         --name redis \
         redis:dev redis-server
