'use strict';

var ratelimiter = require('ffratelimiter')
  , MetaInspector = require('./node-metainspector-modified')
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
        var client = new (MetaInspector())(url, {});
        client.on('fetch', function(){
            var _data = {
                url: client.url,
                host: client.host,
                scheme: client.scheme,
                title: client.ogTitle() || client.title(),
                author: client.author(),
                keywords: client.keywords(),
                charset: client.charset(),
                description: client.description(),
                feeds: client.feeds(),
                internal_links: [],
                external_links: []
            };
            var links = client.links();
            links.forEach(function(link){
                if(link){
                    if (link[0] == '/'){
                        link = client.rootUrl + link;
                        _data.internal_links.push(link);
                    } else if (link[0] == '#') {
                        // skip - in page link
                    } else {
                        if(!link.match(client.host)){
                          _data.external_links.push(link);
                        }else{
                          _data.internal_links.push(link);
                        }
                    }
                }
            });
            callback(null, _data);
        });
        client.on('error', function(err){
            callback(err);
        });
        client.fetch();
    };

    this.getLinksFromHtml = function(html, callback){
        var me = this;
        var client = new (MetaInspector())(null, html);
        client.on('fetch', function(){
            var _data = {
                title: client.ogTitle() || client.title(),
                author: client.author(),
                keywords: client.keywords(),
                charset: client.charset(),
                description: client.description(),
                feeds: client.feeds(),
                links: client.links()
            };
            callback(null, _data);
        });
        client.on('error', function(err){
            callback(err);
        });
        client.parse();
    };

}).call(Scraper.prototype);
