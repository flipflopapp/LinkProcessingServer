'use strict';

var config = {
  redis: {
    host: '127.0.0.1',
    port: 6379,
    username: '',
    password: ''
  }
};

var LinkServer = require('./linkserverwrapper');
var linkServer = new LinkServer(config);

linkServer.getFinalLink('t.co/0OgRtGlQUp',
  function(err, data){
    if(err){
      console.log(err);
    }else{
      console.log(data);
    }
    process.exit(0);
  }
);

