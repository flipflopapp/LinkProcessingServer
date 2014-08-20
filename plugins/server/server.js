'use strict';

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
        _self.$db = serverOptions.db;

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
        var action = req.body.a;
        var url = req.body.u;

        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        
        if(!url){
            return res.send(400, "URL must a part of query");
        }

        if (!action || action == 'redirect'){
            _self.$redirect.getOriginalURL(url, function(err, _url){
                if (err) {
                    return res.send(500, err.message);
                }
                if (url != _url) {
                    var result = {
                        url: url,
                         redirectsto: _url
                    };
                    res.send(result);
                } else {
                    res.send({});
                }
            });
        }

        if (action == 'scrape'){
            _self.$scraper.getStructuredData(url, function(err, data){
                if (err) {
                    return res.send(500, err.message);
                }
                res.send(data);
            });
        }
    };

}).call(Server.prototype);
module.exports = Server;
