Docker latest node
==================

This is a container based on the node-dev in this redpository

To debug your code you can run node with the --inspect flag and --debug-brk to break at the first line.

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
         node:latest bash

In the container you can run npm, your application is in /app so you can run (Dockerfile should have set the squid proxy to use your squid proxy container):

         cd /app
         npm install --verbose

In the current directory (not in build) run the following command (assuming you named the image node:dev):

        docker run -t --rm \
         -v $(pwd)/app:/app \
         -p 80:8888 \
         -p 8080:8080 \
         -p 9229:9229 \
         --name myapp \
         node:latest
         
See the static express for an example.
