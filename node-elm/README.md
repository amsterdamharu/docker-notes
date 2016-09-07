Docker latest node
==================

This is a container based on the node-dev in this redpository

It will install git and the elm nmp package: https://www.npmjs.com/package/elm


Installing
----------

Go to the build directory and run:

        docker build -t yourname:yourtag .
        
Run the container
-----------------

In the current directory (not in build) run the following command (assuming you named the image node:elm)
I am not sure why -p 8000:8000 does not work anymore but --net host is a quick fix that works:

        docker run -it --rm \
         -v $(pwd)/elm:/elm \
         --net host \
         node:elm bash
         
Now you have a bash in your elm container.

You can run use the elm-repl (export LANG prevents elm-repl: fd:6: hGetContents: invalid argument (invalid byte sequence) error):

        export LANG=en_US.UTF-8
        elm-repl
        ---- elm-repl 0.17.1 -----------------------------------------------------------
         :help for help, :exit to exit, more at <https://github.com/elm-lang/elm-repl>
        --------------------------------------------------------------------------------
        > 1 / 2
        0.5 : Float
        > List.length [1,2,3,4]
        4 : Int

You can get the elm-reactor with the following commands:

        cd /elm
        git clone https://github.com/evancz/elm-architecture-tutorial.git
        cd elm-architecture-tutorial

You only need to do this the first time, later you can use git to get the latest version with:

        cd /elm
        git checkout master
        git pull
        
To start the elm-reactor you can issue the following commands:

        cd /elm
        elm-reactor

This will start a server on the container, you can access that server on your host in a browser on port 8000 (localhost:8000)

A guide to elm can be found here: http://guide.elm-lang.org/get_started.html
