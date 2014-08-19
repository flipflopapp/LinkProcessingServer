var http = require('http')
  , https = require('https')
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
        var params = [ urlStr ];
        this.que.callWrapper(me._getOriginalURL, params, callback, this);
    };

    this._getOriginalURL = function(urlStr, cb){
        var me = this;
	    var purl = require('url').parse(urlStr);

	    if (!purl.protocol)
		    purl = require('url').parse("http://"+url);
	
    	var httpModule = purl.protocol === 'https:'
	    	? https
		    : http;

        var options = {
            method: 'HEAD',
            uri: urlStr
        };
	
        var client = httpModule.request(options, function(res){
		    res.setEncoding('utf-8');
		
    		res.on('end', function(){
	    		if (res.statusCode >= 300 && res.statusCode < 400)
		    	{
			    	me._getOriginalURL(res.headers.location, cb);
			    }
			    else
			    {
    		    	cb(null, url);
			    }
            });
	
            client.on('error', function(err){
		        cb(err);
            });
        });
    };

}).call(Redirect.prototype);
