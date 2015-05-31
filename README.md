Docker notes
============

Notes for docker how to use and how to use with proxy


Install on fedora
-----------------

You can use yum to install docker (use sudo)

        yum -y remove docker
        yum -y install docker-io

Start docker
-----------------------

Start docker on startup:

        systemctl enable docker

Start docker manually:

        service docker start
        
Run docker as another user (no sudo)
------------------------------------

If your user name is 'me' then you can run docker as the 'me' user. To set it up run the following commands (as su):

        sudo groupadd docker
        sudo chown root:docker /var/run/docker.sock
        sudo usermod -a -G docker me


Docker in China (with astrill proxy)
------------------------------------

Because in China a lot of sites are blocked or badly available you can use a vpn to have "real" Internet.

The vpn provider Astrill has a desktop application that lets you share the vpn connection. Under settings => vnp sharing you can see it's shared as "your ip" or localhost under port 3213

Docker containers are in the 172.17.42.x range so are not allowed to use that proxy (in my case). You can setup squid on the host so the containers can use squid and squid can use the vpn proxy. There will be more info on how to set up squid.

If you have set up a proxy then the docker client sometimes won't work because it is trying to go through the proxy, you can prevent this with:

        export NO_PROXY="/var/run/docker.sock"
        
Or add /var/run/docker.sock to the ignore host list in the network proxy settings.


Let docker daemon use proxy
---------------------------

Because a docker run and docker build can cause the daemon to try and download the image from a not so available site (Because you're in China) you can have the daemon use the proxy provided by your vpn application.

I am using Astrill that shares the vpn on localhost:3213, no need to have the daemon use squid because it can directly use the proxy. Unless you use boot2docker then the proxy may refuse connections from that ip just as it will refuse connections from you docker containers (more on squid later)

To have the daemon use a proxy create/edit the following file:

        /etc/systemd/system/docker.service.d/http-proxy.conf
        
It should contain the following for proxy information:

        [Service]
        Environment="HTTP_PROXY=http://localhost:3213/"
        Environment="HTTPS_PROXY=http://localhost:3213/"

Reload the config and restart daemon:

        systemctl daemon-reload
        service docker restart

Let docker container use a proxy
--------------------------------

The easiest way is when you run a container is to use the following the option --net host, this will cause the host to be available in the container as localhost. For example:

        docker run -it --rm --net host busybox:latest sh
        
In the container you can now do the following:

        export http_proxy=http://localhost:3213/
        export ftp_proxy=http://localhost:3213/
        export all_proxy=socks://localhost:3213/
        export https_proxy=http://localhost:3213/
        export no_proxy=localhost,127.0.0.0/8,::1
        wget http://www.google.com
        
Google is blocked in China so that would fail if you did not set a proxy.

How about docker build?
-----------------------

If you use a Dockerfile and want to do a docker build you do not have the --net host option, if you want to link a container to another you cannot use that option either.

The host is available in the container as 172.17.42.1 if that is not the case you can execute the following command in the container:

        ip route
        
Because Astrill vpn sharing proxy does not allow 172.17.42.x to use its proxy you may have to set up squid on the host (see later) and have squid use the Astrill vpn proxy.

In your Dockerfile you can now set up the proxy in the following way:

        #set the squid proxy that refers to the astrill proxy
        ENV http_proxy=http://172.17.42.1:3128/
        ENV ftp_proxy=http://172.17.42.1:3128/
        ENV all_proxy=socks://172.17.42.1:3128/
        ENV https_proxy=http://172.17.42.1:3128/
        ENV no_proxy=localhost,127.0.0.0/8,::1

Some applicatons need their config set to use a proxy for example npm does not seem to care about the environment variable but you can set it with (in your Dockerfile):

        RUN npm config set proxy http://172.17.42.1:3128/ && \
            npm config set https-proxy http://172.17.42.1:3128/
        
If you use npm_lazy container then you need to start the container with --net host, set the to be build image to use that container add the following in your Dockerfile:

        npm config set registry http://172.17.42.1:8080/
        
Using squid because vpn proxy does not allow container to use it
----------------------------------------------------------------

An easy way to test if your container can use the proxy is to start the container and try to connect:

        docker run -it --rm busybox:latest sh

In the container try (port 3213 is Astrill vpn proxy):

        export http_proxy=http://172.17.42.1:3213/
        wget http://www.google.com

In my case the vpn software provided proxy refused request coming from the container ip so had to set up squid. Make sure your firewall allows you access as well as that can prevent you from connecting to the proxy.

To install squid (fedora).

        yum install squid.x86_64
        
To tell squid to use the vpn software provided proxy open the following file as su
 
        /etc/squid/squid.conf
        
Add the following lines at the end (Astrill desktop program vpn sharing proxy):

        cache_peer localhost   parent  3213 0 no-query default
        never_direct allow all
        
To not have squid start automatically issue the following command (as su)

        systemctl disable squid.service
        
You can manually start the service with:

        service squid start
        
Check out if there were any errors:

        service squid status

To prevent too many writes to my ssd harddrive my /var/log is mounted as tmpfs and gone on a reboot, this would cause an error because squid could not write to log. To fix it I did the following:

        mkdir /var/log/squid
        chown squid:squid /var/log/squid
        
Squid container
---------------

There is a squid container dockerfile in this repo (under squid) but this container uses a squid proxy on the host to install in the first place. If you can get ubuntu packeges installed without a proxy then you can use the Dockerfile to create a squid container and use that one.

This container will save caches to disk so it could speed up creating the other containers.


