'use strict';

var config = require('./config')

module.exports = function(options, imports, register){
    //setup mongoose
    var db = mongoose.createConnection(config.mongodb.uri);
    db.on('error', console.error.bind(console, 'mongoose connection error: '));
    db.once('open', function () {
        //and... we have a data store
    });

    //config data models
    require('./../../schema/WikiTopic')(db, mongoose);

    //register
    register(null, {
        "db": db
    });
};
