Docker websocket
================

Test websocket, works with express 4 as well but package.json in /app/examples/serverstats-express_3/ uses express 3, you could change it before running npm install

Installing
----------

On the host clone the websocket repo:

        git clone https://github.com/websockets/ws.git .
        
Run the container
-----------------

You may need to npm install some packages that your application depends on. You can do so by starting the container interactively and run npm in the container, the files are saved on the host in the .app/examples/??? directory.

        docker run -it --rm \
         -v $(pwd)/app:/app \
         -v $(pwd)/makecert.sh:/app/makecert.sh \
         node:dev bash

In the container you can run npm, your application is in /app so you can run (assuming you started squid):

         npm config set proxy http://172.17.42.1:3128/
         cd /app/examples/serverstats-express_3/
         npm install --verbose
         cd /app
         npm install --verbose
         bash makecert.sh 'localhost'

In the current directory (not in build) run the following command (assuming you named the image node:dev):

        docker run -d \
         -v $(pwd)/app:/app \
         -v $(pwd)/package.json:/app/package.json \
         -v $(pwd)/server.js:/app/examples/serverstats-express_3/server.js \
         -v $(pwd)/index.html:/app/examples/serverstats-express_3/public/index.html \
         -w /app/examples/serverstats-express_3/ \
         -p 8080:8080 \
         --name myapp \
         node:dev
         
You can see the application running at https://localhost:8080.
