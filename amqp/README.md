Docker amqp examples
====================

This is a container has examples using rabitmq. Start the rabbitmq image so it is available on 172.17.42.1:5672

Installing
----------

No build required, you can run the node:dev image. If you want the node:dev image to install the required node packages you can run node:dev in this directory (amqp) like so:

        docker run -it --rm \
         -v $(pwd)/app:/app \
         -w /app \
         node:dev \
         bash

Then issue the following commands:

        npm config set proxy http://172.17.42.1:3128/
        npm install --verbose

Run the container
-----------------

In the current directory (not in build) run the following command:

        docker run -it --rm \
         -v $(pwd)/app:/app \
         -w /app \
         node:dev \
         bash
         
The examples are in /app/node_modules/amqplib/examples/tutorials

Because these examples have dependencies you can install them by running the following commands in the container.

        cd /app/node_modules/amqplib/examples/tutorials
        npm config set proxy http://172.17.42.1:3128/
        npm install --verbose

Make sure you open port 5672 in your firewall settings.

You can change localhost in the code to 172.17.42.1 or change it in the /etc/hosts

The user guest is not allowed to connect remotely so you should add a user, when you start rabbitmq with the management console you can add a user at the following url:

        http://localhost:15672/#/users

After creating the users you have to log in as that user, in the examples when connecting to rabbitmq use something like:

        amqp.connect('amqp://user:password@localhost')

or if you did not change the /etc/hosts:

        amqp.connect('amqp://user:password@172.17.42.1')
