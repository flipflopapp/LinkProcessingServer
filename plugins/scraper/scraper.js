'use strict';

var ratelimiter = require('ffratelimiter')
  , Scraper = require('scrapify')
  ;

module.exports = function(options, imports, register){
    console.log("Setup Scraper module");
    var scraper = new Scraper();
    register(null, {
        "scraper": scraper
    });
};

var Scraper = function() {
    console.log("Setup Scraper module.");
    var me = this;
    var params = {
        limit: 10,
        window: 100, // ms
        concurrency: 10,
        attempts: 2
    };
    me.que = new ratelimiter(params);
};

(function() {

    this.getStructuredData = function(url, callback){
        var params = [ url ];
        this.que.callWrapper(me._getStructuredData, params, callback, this);
    };

    this._getStructuredData = function(url, callback) {
        var scraper = new Scraper();
        var data = {
            links: []
        };
        var hostname = url.hostname;
        scraper.pageHandler = function(url, $){
            var urls = $('a').each(function(){
                var _url = this.href;
                if (_url[0] == '/') {
                    _url = hostname + _url;
                }
                data.links.push( _url );
            });
        };
        this.scraper.addUrl(url);
        this.scraper.run(function() {
            callback(null, data);
        });
    };

}).call(Scraper.prototype);
