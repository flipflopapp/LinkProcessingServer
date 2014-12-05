LinkProcessingServer
====================

A server that can be used for different kinds of link processing, such as scraping, NLP extractions, etc. It can be used in micro-architecture environments, where the client facing server does not wants to do these operations externally.

This is built as a part of REWQ.co and has following functionalities, given a URL it can :-

1. Scrape links
2. Find the original URL (given redirects)

The server accepts above jobs on kue (a priority queue backed by redis https://github.com/learnboost/kue).


External Dependencies
=====================

Needs a Redis server on localhost.

Run the server
==============

Install dependencies

        $ npm install

Start the server

        $ node app.js

Configure the server
====================

Configure the redis port - update in app.js.
The default host:port is 127.0.0.1:6379

Running the examples
====================

You can learn how to use this code by quickly looking at the examples.

To run an example,

        $ node example/testapp.js

Architecture
============

We have used architect.js to structure the server. It allows easily extending or configuring the functionality by writing new plugins.

For scraping, we have used scrapify.
