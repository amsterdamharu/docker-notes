Docker express
==============

An example how to use the node dev image.

Installing
----------

In your package.json add "scripts.start" and have that contain the command to run your application. Because the node dev will run npm start (see package.json in app).
        
Run the container
-----------------

You may need to npm install some packages that your application depends on. You can do so by starting the container interactively and run npm in the container, the files are saved on the host in the .app directory.

        docker run -it --rm \
         -v $(pwd)/app:/app \
         node:dev bash

In the container you can run npm, your application is in /app so you can run:

         cd /app
         npm install --verbose

In the current directory (not in build) run the following command (assuming you named the image node:dev):

        docker run -d \
         -v $(pwd)/app:/app \
         -w /app \
         -p 80:8888 \
         -p 8080:8080 \
         -p 5858:5858 \
         --name myapp \
         node:dev
         
You can see the application running at http://localhost or http://127.0.0.1, use Chrome to debug the application.
