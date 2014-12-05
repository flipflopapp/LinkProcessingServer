'use strict';

var kue = require('kue');
var request = require('request'),
    url = require('url');

var LinkServerWrapper = function(config){
  this.jobs = kue.createQueue({
    prefix: 'l',
    redis: {
      host : config.redis.host,
      port : config.redis.port,
      user : config.redis.username,
      pass : config.redis.password
    }
  });
};

(function(){

  this.getFinalLink = function(link, callback){
    var job = this.jobs.create(
      'resolveUrl',
    {
      u: link
    })
    .priority('normal')
    .attempts(2)
    .on('complete', function(result){
      return callback(null, result);
    })
    .on('failed', function(err){
      return callback(new Error('resolveUrl failed: ' + link));
    })
    .save(function(err){
      if(err){
        return callback(err);
      }
    });
  };

  this.getLinkDetails = function(link, callback){
    var job = this.jobs.create(
      'scrape',
    {
      u: link
    })
    .priority('low')
    .attempts(2)
    .on('complete', function(result){
      return callback(null, result);
    })
    .on('failed', function(err){
      return callback(new Error('scrape failed: ' + link));
    })
    .save(function(err){
      if(err){
        return callback(err);
      }
    });
  };

  this.getScrapeLinksFromHtml = function(html, callback){
    var job = this.jobs.create(
      'html',
    {
      u: link
    })
    .priority('low')
    .attempts(2)
    .on('complete', function(result){
      return callback(null, result);
    })
    .on('failed', function(err){
      return callback(new Error('html scrape failed'));
    })
    .save(function(err){
      if(err){
        return callback(err);
      }
    });
  };

}).call(LinkServerWrapper.prototype);

module.exports = LinkServerWrapper;
