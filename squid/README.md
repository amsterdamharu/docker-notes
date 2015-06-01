Docker squid cache proxy
========================

This is a container running a squid proxy that will connect to the Astrill proxy and save caches to disk on the host.

If you do not want the squid proxy to connect to another proxy you can comment out the following lines from the squid.conf:

        cache_peer localhost   parent  3213 0 no-query default
        never_direct allow all  

Cache files are saved in ./cachedir logs are in ./log and the configuration file is in ./squid.conf (when you run it according to the instructions)

Installing
----------

Go to the build directory and run:

        docker build -t yourname:yourtag .

When the image is created you need to do some setup. Lets say you created an image called squid:2015-05, you can run the image from the squid directory with the following command:

        docker run -it --rm \
         -v $(pwd)/squid.conf:/etc/squid3/squid.conf \
         -v $(pwd)/cachedir:/cachedir \
         -v $(pwd)/log:/var/log/squid3/ \
         squid:2015-05 bash

In the container run the following command:

        chown proxy:proxy /cachedir && \
        chown proxy:proxy /var/log/squid3 && \
        /usr/sbin/squid3 -z
        
The command should show something ending with exited with status 0. You can press control + c and type exit to get out of the container.
        
Run the container
-----------------

You may need to add execution permission to the run.sh file in the current directory, you can do so with:

        chmod +x run.sh

In the current directory (not in build) run the following command:

        docker run -d \
         -v $(pwd)/squid.conf:/etc/squid3/squid.conf \
         -v $(pwd)/cachedir:/cachedir \
         -v $(pwd)/log:/var/log/squid3/ \
         -v $(pwd)/run.sh:/root/run.sh \
         --name squid \
         --net host \
         squid:2015-05 \
         bash /root/run.sh
