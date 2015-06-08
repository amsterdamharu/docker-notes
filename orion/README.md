Docker orion develop image
==========================

This is a container running a modified orion server, it has java and git installed

Installing
----------

Go to the build directory and run:

        docker build -t orion:dev .
        
Run the container
-----------------

In the current directory (not in build) run the following command:

        docker run -d \
         -v ~/orion:/orion \
         -v $(pwd)/app:/orion/serverworkspace/am/amsterdamharu/OrionContent/test \
         -w /orion \
         -u 1000 \
         -p 9999:9999 \
         --name orion \
         orion:dev \
         eclipse/orion

Parameter explanation:

        -v ~/orion:/orion

Assuming you have orion in ~/orion on your host (you should have a ~/orion/eclipse directory), you can download orion from http://download.eclipse.org/orion/ and extract it in ~/orion

         -v $(pwd)/app:/orion/serverworkspace/am/amsterdamharu/OrionContent/test \

After you create a project a serverworkspace will be created, you can mount your project files into that directory on the server.

         -u 1000 \

My user account id is 1000, so files created by the ide are owned by me, if you do not add these options files in your project are owned by root.

         -p 9999:9999 \

In ~/orion/eclipse/orion.ini I changed the port to get to the server to 9999 you can do that with the following line:

        -Dorg.eclipse.equinox.http.jetty.http.port=9999
