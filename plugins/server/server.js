'use strict';

var kue = require('kue');

module.exports = function setup(options, imports, register) {
    console.log("Setup Core module.");
    var server = new Server(options, imports);
    if(server.start()){
      register(null, {
        "server": server
      });
    }else{
      console.log('error starting the server');
    }
};

var Server = function(options, imports){
    this.DEBUG = options.DEBUG,
    this.$scraper = imports.scraper;
    this.$resolveurl = imports.resolveurl;
    this.$db = imports.db;
    this.jobs = kue.createQueue({
      prefix: 'l',
      redis: {
        host : options.redis.host,
        port : options.redis.port,
        user : options.redis.username,
        pass : options.redis.password
      }
    });
};

(function(){

    this.start = function(data, done){
      var me = this;
      this.jobs.process('resolveUrl', function(job, done){
        me.doResolveUrl(job.data, done);
      });
      this.jobs.process('scrape', function(job, done){
        me.doScrapeUrl(job.data, done);
      });
      this.jobs.process('html', function(job, done){
        me.doScrapeHtml(job.data, done);
      });
      return true;
    };

    this.doResolveUrl = function (data, done) {
      this.DEBUG && console.log("doResolveUrl: " + data.u);
      var url = data.u;
      if(!url){
        return done(new Error("Url required."));
      }
      this.$resolveurl.getOriginalURL(url, function(err, _url){
        if (err) {
          return done(new Error(err.message));
        }
        if (url != _url) {
          var result = {
            url: url,
            resolve: _url
          };
          done(null, result);
        } else {
          done();
        }
      });
    };

    this.doScrapeUrl = function (data, done) {
      this.DEBUG && console.log("doScrapeUrl: " + data.u);
      var url = data.u;
      if(!url){
        return done(new Error("Url required."));
      }
      this.$scraper.getStructuredData(url, done);
    };

    this.doScrapeHtml = function (data, done) {
      this.DEBUG && console.log("doScrapeHtml: " + data.u);
      var url = data.u;
      if(!url){
        return done(new Error("Url required."));
      }
      this.$scraper.getLinksFromHtml(text, done);
    };

}).call(Server.prototype);
