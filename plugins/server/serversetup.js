// This file sets up the server, the sockets, etc
'use strict';

var connect = require('connect')
  , express = require('express')
  , path = require('path')
  ;

var Server = require('./server')
  ;

// called by architect

module.exports = function setup(options, imports, register) {
    console.log ( "Setup Core module." );

    var app = express();

    // configure express

    app.configure('development', function() {
        app.set(express.errorHandler({ dumbExceptions: true }));
        app.set('view options', {
            pretty: true
        });
    });

    app.configure('production', function() {
    });

    app.configure(function() {
        var oneYear = 31557600000;
        app.set('views', path.join(__dirname, '/../../'));
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger());
        app.use(express.static(path.join(__dirname, '/../../')), { maxAge: oneYear });
        app.use(express.bodyParser());
        app.use(app.router);
    });

    var serverOptions = {
        app: app
      , scraper: imports.scraper
      , redirect: imports.redirect
      , db: imports.db
    };
    var server = new Server();
    server.init (serverOptions);

    //initSocketIo(app, sessStore, server);

    register(null, {
        "server": server
    });
};

function initSocketIo(app, sessStore, server) {
    var socketIo = IO.listen(app);
    socketIo.enable("browser client minification");
    socketIo.set("log level", 1);
    socketIo.set("close timeout", 7);
    socketIo.set("heartbeat timeout", 2.5);
    socketIo.set("heartbeat interval", 5);
    socketIo.set("polling duration", 5);
    socketIo.sockets.on("connection", function(client) {
        client.on("message", function(data) {
            var message = data;
            if (typeof data == "string") {
                try {
                    message = JSON.parse(data);
                } catch(e) {
                    return;
                }
            }
            if ( message.command === "attach" ) {
                sessStore.get(message.sessionId, function(err, session) {
                    if (err || !session || !session.uid)
                        return;
                    server.addClientConnection(session.uid);
                });
            }
        });
    });
}
