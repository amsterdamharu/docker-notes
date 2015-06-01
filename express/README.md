Docker express
==============

An example how to use the node dev image.

Installing
----------

In your package.json add "scripts.start" and have that contain the command to run your application. Because the node dev will run npm start (see package.json in app).

On the host run an nmp install if your application needs packages installed (like express in the example).

If the host does not have npm you can build an image based off the node dev image (see build directory). Copy package.json to build first.
        
Run the container
-----------------

In the current directory (not in build) run the following command (assuming you named the image node:dev):

        docker run -d \
         -v $(pwd)/app:/app \
         -w /app \
         -p 80:8888 \
         -p 8080:8080 \
         -p 5858:5858 \
         --name myapp \
         node:dev
         

