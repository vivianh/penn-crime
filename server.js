var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res) {

  url = 'http://www.upenn.edu/almanac/volumes/v60/n01/creport.html'
  // url = 'http://www.upenn.edu/almanac/crimes-index.html'

  request(url, function(err, res, html) {
    if (!err) {

      $ = cheerio.load(html);
      
      var kids = []
      $('table[border=1]').each(function (i, e) {
        if ($(e).get('0').attribs.cellpadding === '3') {
          // console.log($(e).children().length);
          kids.push($(e).children());
        }
      });

      var crimes = []
      $(kids).each(function (i, e) {
        $(e).each(function(j, x) {
          var date, time, loc, type;
          var json = { date : "", time : "", loc : "", type : "" };
          json.date = $(x).children().first().find('span').text();
          json.time = $(x).children().next().first().find('span').text();
          json.loc  = $(x).children().next().next().first().find('span').text();
          json.type = $(x).children().next().next().next().first().find('span').text();
          // console.log(json);
          crimes.push(json);
        });
      });

    }
  });

});

app.listen('3000');

exports = module.exports = app;
