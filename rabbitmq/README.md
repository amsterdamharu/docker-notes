Docker rabitmq
==============

This is a container running rabitmq available on port ...

Installing
----------

Go to the build directory and run:

        wget (fill in url from deb file when site is up again)
        docker build -t rabbitmq:dev .

After building start the container in the current directory with the following options

        docker run -it --rm \
         -v $(pwd)/rabbitmq.config:/etc/rabbitmq/rabbitmq.config \
         -v $(pwd)/log:/var/log/rabbitmq \
         --name rabitmq \
         rabbitmq:dev \
         bash

Then issue the following commands:

        chown -R rabbitmq:rabbitmq /var/log/rabbitmq &&
        chown rabbitmq:rabbitmq /etc/rabbitmq/rabbitmq.config

Run the container
-----------------

In the current directory (not in build) run the following command:

        docker run -it --rm \
         -v $(pwd)/rabbitmq.config:/etc/rabbitmq/rabbitmq.config \
         -v $(pwd)/log:/var/log/rabbitmq \
         -p 15672:15672 \
         -p 5672:5672 \
         --name rabbitmq \
         rabbitmq:dev bash
         
To start the server:
         
         rabbitmq-server

In the console you can start the management plugin in the following way:

        rabbitmq-plugins enable rabbitmq_management
        rabbitmqctl add_user test test
        rabbitmqctl set_user_tags test administrator
        rabbitmqctl set_permissions -p / test ".*" ".*" ".*"

You can now open the management console with http://localhost:15672
