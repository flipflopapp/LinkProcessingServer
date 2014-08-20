var architect = require("architect")
  , mongoose = require('mongoose')
  ;

var config = [
  "./plugins/server",
  "./plugins/redirect",
  "./plugins/scraper",
  "./plugins/eventbus"
];

var tree = architect.resolveConfig(config, __dirname);

architect.createApp(tree, function() {
    console.log("Application started");
});
