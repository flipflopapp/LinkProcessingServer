var architect = require("architect")
  ;

var config = [
  "./plugins/server",
  "./plugins/eventbus",
  "./plugins/scraper",
  "./plugins/redirect"
];

var tree = architect.resolveConfig(config, __dirname);

architect.createApp(tree, function() {
    console.log("Application started");
});
