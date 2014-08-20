'use strict';

var ratelimiter = require('ffratelimiter')
  , MetaInspector = require('node-metainspector')
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
        var me = this;
        var params = [ url ];
        me.que.callWrapper(me._getStructuredData, params, callback, me);
    };

    this._getStructuredData = function(url, callback) {
        var me = this;
        var client = new MetaInspector(url, {});
        client.on('fetch', function(){
            var data = {
                url: client.url,
                host: client.host,
                scheme: client.scheme,
                title: client.title,
                author: client.author,
                keywords: client.keywords,
                charset: client.charset,
                description: client.description,
                feeds: client.feeds,
                internal_links: [],
                external_links: []
            };
            var links = client.links();
            links.forEach(function(link){
                if (link[0] == '/'){
                    link = client.scheme + '://' + client.host + link;
                    data.internal_links.push(link);
                } else if (link[0] == '#') {
                    // skip - in page link
                } else {
                    data.external_links.push(link);
                }
            });
            callback(null, data);
        });
        client.on('error', function(err){
            callback(err);
        });
        client.fetch();
    };

}).call(Scraper.prototype);
