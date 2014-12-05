var architect = require("architect")
  , mongoose = require('mongoose')
  ;

var redis = {
  host: '127.0.0.1',
  port: 6379,
  username: '',
  password: ''
};

var config = [
  {
    packagePath: "./plugins/server",
    redis: redis
  },
  "./plugins/resolveurl",
  "./plugins/scraper",
  "./plugins/eventbus"
];

var tree = architect.resolveConfig(config, __dirname);

architect.createApp(tree, function() {
    console.log("Application started");
});
