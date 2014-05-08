var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var _ = require('underscore');
var app = express();

app.get('/scrape', function (req, res) {
  // 'use strict';

  var API_KEY = 'AIzaSyCYJB2oSbvvBTLH2_Zuhpyw_lL0XzuYABw';
  var geocode = 'https://maps.googleapis.com/maps/api/geocode/json?';
  var southwest = '39.948907,-75.249186';
  var northeast = '39.966538,-75.163356';
  var bounds = southwest + '|' + northeast;

  var url = 'http://www.upenn.edu/almanac/crimes-index.html';
  var self = this;
  self.check = true;
  self.crimes = [];
  self.geocode = geocode + 'sensor=false' +
                 '&bounds=' + bounds +
                 '&key=' + API_KEY;

  request(url, function (err, resp, html) {
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

      var finished = _.after(links.length, writeToFile);

      links.forEach(function (_link) {
        request(_link, function (_err, _res, _html) {
          // console.log(_link);
          // console.log('err', _err);
          if (!_err) {

            var kids = [];

            $ = cheerio.load(_html);

            $('table[border=1]').each(function (i, e) {
              if ($(e).get('0').attribs.cellpadding === '3') {
                kids.push($(e).children());
              }
            });

            var date, time, loc, type, lat, lng;
            var json = { date : "", time : "", loc : "",
                         type : "" , lat : "", lng : "" };

            $(kids).each(function (i, e) {
              $(e).each(function(j, x) {

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

                getLatLng(json);
                // self.crimes.push(getLatLng(json));
              });
            });
          }

          finished();
        });
      });
    }

    function getLatLng(json) {
      request(self.geocode + '&address=' + json.loc, function (err_, response, body) {
        if (!err_) {
          console.log(json);
          jsonObj = JSON.parse(body);
          if (jsonObj['results'][0] !== undefined) {
            var lat = jsonObj['results'][0]['geometry']['location']['lat'];
            var lng = jsonObj['results'][0]['geometry']['location']['lng'];
            json.lat = lat;
            json.lng = lng;
            // console.log(json);
            self.crimes.push(json);
          }
        }
      });
    }

    function writeToFile() {
      fs.writeFile('output.json', JSON.stringify(self.crimes, null, 4), function (err_) {
        if (!err_) {
          console.log('file written successfully!');
        } else {
          console.log('aw man');
        }
      });
      res.send('check for output.json in your directory!');
    }

  });
});


app.listen('3000');

exports = module.exports = app;
