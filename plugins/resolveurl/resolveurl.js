var request = require('request')
  , ratelimiter = require('ffratelimiter')
  ;

module.exports = function(options, imports, register){
    console.log("Setup Resolve module");
    var resolve = new Resolve();
    register(null, {
        "resolveurl": resolve
    });
};

var Resolve = function() {
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
            followAllResolves: true,
            maxResolves: 10
        };

        request(options, function(err, res){
            if (err) {
                return cb(err);
            }
            return cb(null, res.request.uri.href );
        });
    };

}).call(Resolve.prototype);
