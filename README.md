Pipe Injector
=============
Node.js script that can detect when "curl ... | bash" is being used and serve a different file than normal. This is an implementation of this article https://www.idontplaydarts.com/2016/04/detecting-curl-pipe-bash-server-side/

Requirements
------------
* Node.js v8 or Node.js v7 using the [harmony flag](https://nodejs.org/en/docs/es6/).

Usage
-----
The first 4 lines of injector.js are the settings used to configure the program:
* initalFile is the file sent regardless of good or bad. It must be set to a file in it that has at least a `sleep` inside. I've found 2 seconds to work, but other delays may be necessary.
* goodFile is the file served if piping is not detected.
* badFile is the file served if piping is detected.
* Port is what port number to bind the HTTP server on
* minStd is the minimum standard deviation of the time needed to send each "filler" packet required to send badFile

Warning
-------
This program is created only for educational purposes only. Do not use this on anyone without their informed consent.