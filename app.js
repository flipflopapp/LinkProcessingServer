var architect = require("architect")
  ;

var config = [
  "./plugins/clientserver",
  "./plugins/eventbus",
  "./plugins/redirect",
  "./plugins/scraper",
];

var tree = architect.resolveConfig(config, __dirname);

architect.createApp(tree, function() {
    console.log("Application started");
});
