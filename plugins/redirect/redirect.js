var request = require('request')
  , ratelimiter = require('ffratelimiter')
  ;

module.exports = function(options, imports, register){
    console.log("Setup Redirect module");
    var redirect = new Redirect();
    register(null, {
        "redirect": redirect
    });
};

var Redirect = function() {
    var me = this;
    var params = {
        limit: 10,
        window: 100, // ms
        concurrency: 10,
        attempts: 2
    };
    me.que = new ratelimiter(params);
};

(function(){

    this.getOriginalURL = function(urlStr, cb){
        var me = this;
        var params = [ urlStr ];
        me.que.callWrapper(me._getOriginalURL, params, cb, me);
    };

    this._getOriginalURL = function(urlStr, cb){
        var me = this;
	    var purl = require('url').parse(urlStr);
	
	    if (!purl.protocol)
		    purl = require('url').parse("http://"+urlStr);
	
        url = require('url').format(purl);
	
        var options = {
            uri: url,
            method: 'HEAD',
            timeout: 10000,
            followAllRedirects: true,
            maxRedirects: 10
        };

        request(options, function(err, res){
            if (err) {
                return cb(err);
            }
            return cb(null, res.request.uri.href );
        });
    };

}).call(Redirect.prototype);
