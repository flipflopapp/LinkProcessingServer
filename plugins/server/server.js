var User = require('./user')
  , check = require('validator').check
  ;

var Server = function() {
};

(function() {

    /* We are using this particular pattern because express
     * (get/post) never calls us in context of Server object.
     * This way we always have '_self' to refer back to self.
     */

    var _self = this;

    this.init = function (serverOptions) {
        _self.$app = serverOptions.app;
        _self.$scraper = serverOptions.scraper;
        _self.$redirect = serverOptions.redirect;

        // setup APIs
        var app = _self.$app;

        app.post('/', _self.doStuff );

        // Listen on a port

        var port = process.env.PORT || 5000;
        app.listen(port, function() {
            console.log("Listening on " + port);
        });
    };

    this.use = function(middleware) {
        _self.$app.use(middleware);
    };

    // Routes

    this.doStuff = function (req, res) {
        var action = req.params.action;
        var url = req.params.url;

        if (!action || action == 'redirect'){
            _self.$redirect(url, function(err, url){
                if (err) {
                    return res.send(500, err.message);
                }
                res.send(200, { original: url });
            });
        }

        if (action == 'scrape'){
            _self.$scraper(url, function(err, data){
                if (err) {
                    return res.send(500, err.message);
                }
                res.send(200, data);
            });
        }
    };

}).call(Server.prototype);
module.exports = Server;
