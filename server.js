var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function (req, res) {

  var url = 'http://www.upenn.edu/almanac/crimes-index.html'
  this.crimes = [];
  var self = this;

  request(url, function (err, res, html) {
    if (!err) {

      var links = [];

      $ = cheerio.load(html);

      $('table[border=0]').each(function (i, e) {
        if ($(e).get('0').attribs.cellpadding === '10') {
          var anchors = $(e).find('a');

          $(anchors).each(function(j, x) {
            var link = $(x).attr('href');
            if (link.substring(0, 4) !== 'http') {
              link = 'http://www.upenn.edu/almanac/'.concat(link);
            }
            links.push(link);
          });
        }
      });

      // links = ['http://www.upenn.edu/almanac/volumes/v60/n33/creport.html'];

      links.forEach(function (link) {
        request(link, function (err, res, html) {
          if (!err) {

            var kids = [];

            $ = cheerio.load(html);

            $('table[border=1]').each(function (i, e) {
              if ($(e).get('0').attribs.cellpadding === '3') {
                kids.push($(e).children());
              }
            });

            $(kids).each(function (i, e) {
              $(e).each(function(j, x) {
                var date, time, loc, type;
                var json = { date : "", time : "", loc : "", type : "" };

                if ($(x).children().first().find('span').length != '0') {
                  json.date = $(x).children().first().find('span').text();
                  json.time = $(x).children().next().first().find('span').text();
                  json.loc  = $(x).children().next().next().first().find('span').text();
                  json.type = $(x).children().next().next().next().first().find('span').text();
                } else {
                  json.date = $(x).children().first().text();
                  json.time = $(x).children().next().first().text();
                  json.loc  = $(x).children().next().next().first().text();
                  json.type = $(x).children().next().next().next().first().text();
                }

                self.crimes.push(json);
              });
            });

          }
        });

      });
    }
  });

});


app.listen('3000');

exports = module.exports = app;
