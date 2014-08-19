LinkProcessingServer
====================

A server that can be used for different kinds of link processing, such as scraping, NLP extractions, etc. It can be used in micro-architecture environments, where the client facing server does not wants to do these operations externally.

This is built as a part of REWQ.co and has following functionalities, given a URL it can :-

1. Scrape links
2. Find the original URL (given redirects)


Run the server
==============

  node app.js

Configure the server
====================

Configure the port - update in app.js.
By default, the server runs on port 5000.


Architecture
============

We have used architect.js to structure the server. It allows easily extending or configuring the functionality by writing new plugins.

For scraping, we have used scrapify.
