Docker webcrt
==============

Using node:dev container; this will run peerjs-server and a video chat example using peers/peerjs and peer/peerjs-server. The server is available on port 80.

Installing
----------

Go to the build directory and run (could use bower):

        cd app/static
        # get peerjs client script from github and save it in app/static/peer.js
        wget https://raw.githubusercontent.com/peers/peerjs/master/dist/peer.js
        # get jquery and save it in app/static/jquery.min.js
        wget http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js

To install node dependencies you can start the server in the following way (from webcrt directory)

        docker run -it --rm \
         -v $(pwd)/app:/app \
         -w /app \
         node:dev \
         bash

The following commands will install dependencies using the squid proxy:

        npm config set proxy http://172.17.42.1:3128/
        http_proxy=http://172.17.42.1:3128
        npm install --verbose

Run the container
-----------------

In the current directory (webcrt) run the following command:

        docker run -d \
         -v $(pwd)/app:/app \
         -w /app \
         -p 80:8888 \
         -p 8080:8080 \
         -p 5858:5858 \
         --name webcrt \
         node:dev
