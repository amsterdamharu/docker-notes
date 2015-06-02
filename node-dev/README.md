Docker node dev
===============

This is a container based on google/nodejs-runtime. The program to run is defined in scripts in the package.json:

        "scripts": {
          "start": "node-inspector --save-live-edit & node --debug /app/server.js"
        }

It contains node, grunt and node-inspector.

For an example check the express directory

Installing
----------

Go to the build directory and run:

        docker build -t yourname:yourtag .
        
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

        docker run -t --rm \
         -v $(pwd)/app:/app \
         -p 80:8888 \
         -p 8080:8080 \
         -p 5858:5858 \
         --name myapp \
         node:dev
         
See the static express for an example.
