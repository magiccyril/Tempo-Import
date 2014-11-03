#!/usr/bin/env node
var fs     = require('fs')
  , util   = require('util')
  , parse  = require('csv-parse')
  , moment = require('moment')
  , request = require('request')
  , config = require('./config');


var argv = process.argv;
argv.shift();
argv.shift();

var dry = false;
var files = [];

argv.forEach(function (val, index, array) {
  if ('--dry' == val || '-d' == val) {
    dry = true;
  }
  else {
    files.push(val);
  }
});

if (0 == files.length) {
  util.error('[ERROR] Please enter filepath');
  util.error('usage : node import.js [--dry] filepath');
  return;
}

for (var i = 0; i < files.length; i++) {
  fs.readFile(files[i], readFile);
}

function readFile (err, csv) {
  if (err) {
    throw err;
  }

  parse('' + csv, { delimiter: ';' }, parseAndImportFile);
}

function parseAndImportFile (err, data) {
  if (err) {
    throw err;
  }

  var counter = 0;

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var date = moment(row[0], 'DD/MM/YYYYY');
    var color = row[1].toLowerCase();

    switch (color) {
      case 'bleu':
        color = 'blue';
        break;

      case 'blanc':
        color = 'white';
        break;

      case 'rouge':
        color = 'red';
        break;
    }

    var object = {
      year: date.format('YYYY'),
      month: date.format('M'),
      day: date.format('D'),
      color: color
    };

    if (false === dry) {
      request.post({
        url: config.apiUrl + '/tempo?apikey=' + config.apiKey,
        json: object
      }, function(error, response, html) {
        if (error || response.statusCode != 200) {
          util.error("[ERROR] can't import row : " + counter);
        }

        counter++;
      });
    }
  }

  return;
}
