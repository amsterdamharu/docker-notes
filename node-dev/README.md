Docker node dev
===============

This is a container based on google/nodejs-runtime, add a package.json where you can install packes on the host with npm install. The program to run is defined in scripts:

        "scripts": {
          "start": "node-inspector --save-live-edit & node --debug /app/server.js"
        }

It contains node, grunt and node-inspector.

For an example check the static-express directory

Installing
----------

Go to the build directory and run:

        docker build -t yourname:yourtag .
        
Run the container
-----------------

In the current directory (not in build) run the following command (assuming you named the image node:dev):

        docker run -t --rm \
         -v $(pwd)/server:/app \
         -p 80:8888 \
         -p 8080:8080 \
         -p 5858:5858 \
         --name myapp \
         node:dev
         
See the static express for an example.
