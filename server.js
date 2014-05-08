var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape/:week', function (req, res) {

  url = 'http://www.upenn.edu/almanac/volumes/v60/n01/creport.html'

  request(url, function (err, res, html) {
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

app.get('/scrape', function (req, res) {
  url = 'http://www.upenn.edu/almanac/crimes-index.html'

  request(url, function (err, res, html) {
    if (!err) {
      $ = cheerio.load(html);

      var links = [];
      $('table[border=0]').each(function (i, e) {
        if ($(e).get('0').attribs.cellpadding === '10') {
          var anchors = $(e).find('a');
          $(anchors).each(function(j, x) {
            // console.log($(x).attr('href'));
            var link = $(x).attr('href');
            if (link.substring(0, 4) !== 'http') {
              link = 'http://www.upenn.edu/almanac/'.concat(link);
            }
            links.push(link);
          });
        }
      });

      links.forEach(function (link) {
      });
    }
  });
  
});

app.listen('3000');

exports = module.exports = app;
