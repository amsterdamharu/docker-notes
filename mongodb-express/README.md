Docker express
==============

An example how to use the node dev image running mongodb-express. The package.json are the dependecies and startup script.

Installing
----------

In the .app directory check out the repository that can handle mongodb 3 using download the following and unzip in .app

        https://github.com/andzdroid/mongo-express/archive/b71272a4b74b499e8a1795ed535a5db51d5af8ea.zip

Run the squid server and then start the container by running the following command in the current directory (mongodb-express).

        docker run -it --rm \
         -v $(pwd)/app:/app \
         -w /app \
         node:dev bash

In the container run the following command to install the dependencies needed:

        npm config set proxy http://172.17.42.1:3128 && \
        npm config set https-proxy http://172.17.42.1:3128 && \
        npm install --verbose && \
        exit

The owner of the node_modules directory and files is now root so on the host issue the following command to change ownership back to you (replace you with your user account).

        sudo chown -R you:you app/node_modules

The configuration can be found in ./config.js
        
Run the container
-----------------

Run the mongodb dev image (See mongodb directory) (TODO: use docker compose file).

Open port 27017 in your firewall settings on your host.

In the current directory (not in build) run the following command (assuming you named the image node:dev):

        docker run -it --rm \
         -v $(pwd)/app:/app \
         -v $(pwd)/config.js:/app/config.js \
         -w /app \
         -p 80:80 \
         -p 8080:8080 \
         -p 5858:5858 \
         --name mongo-express \
         node:dev
         
You can see the application running at http://localhost, username and password is admin pass but you can change it in the app/node_modules/mongo-express/config.js
