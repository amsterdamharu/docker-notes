Docker express
==============


mongodb-express seems to be broken
==================================

Tried in a couple of different ways to get it going but after updating mongodb all I see is "Turn on admin in config.js to view server stats!", console.log out the config and it is exactly the same as a "working" version before I update mongodb. At the time this repo is useless with version 3 of mongodb, will try again later.

An example how to use the node dev image running mongodb-express. The package.json are the dependecies and startup script.

Installing
----------

Run the squid server and then start the container by running the following command in the current directory (mongodb-express).

        docker run -it --rm \
         -v $(pwd)/app:/app \
         -w /app \
         node:dev bash

In the container run the following command to install the dependencies needed on the host:

        npm config set proxy http://172.17.42.1:3128 && \
        npm config set https-proxy http://172.17.42.1:3128 && \
        npm install --verbose && \
        exit

The owner of the node_modules directory and files is now root so on the host issue the following command to change ownership back to you (replace you with your user account).

        sudo chown -R you:you app/node_modules

This may not be needed in later versions of mongo-express but my mongodb driver did not work with mongodb 3.0.3. To try and fix it I ran the container same as before mentioned and executed the following

        cd node_modules/mongo-express/ && \
        rm -rf node_modules/mongodb && \
        npm config set proxy http://172.17.42.1:3128 && \
        npm config set https-proxy http://172.17.42.1:3128 && \
        npm install --verbose mongodb@2.0.33 && \
        exit

This did not fix anything and only got me a "Turn on admin in config.js to view server stats!" message after logging in
=======================================================================================================================

The configuration can be found in ./config.js
        
Run the container
-----------------

Run the mongodb dev image (See mongodb directory) (TODO: use docker compose file).

Open port 27017 in your firewall settings on your host.

In the current directory (not in build) run the following command (assuming you named the image node:dev):

        docker run -it --rm \
         -v $(pwd)/app:/app \
         -v $(pwd)/config.js:/app/node_modules/mongo-express/config.js \
         -w /app \
         -p 80:80 \
         --name mongo-express \
         node:dev
         
You can see the application running at http://localhost, username and password is admin pass but you can change it in the app/node_modules/mongo-express/config.js


TODO: run container as daemon not '-it --rm' but with -d. Current option is useful to see output
