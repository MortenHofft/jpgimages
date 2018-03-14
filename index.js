const express = require('express');
const app = express();
const url = require('url');
// const getUrls = require('get-urls');
var fetchUrl = require("fetch").fetchUrl;
const urlRegex = require('url-regex');
const PORT = process.env.PORT || 5000;
const _ = require('lodash');

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};
app.use(allowCrossDomain);

app.get('/', function(req, res){
  res.send('version 0.1')
});

app.get('/images', function(req, res){
  var reqUrl = req.query.url;
  getImages(reqUrl, function(err, images){
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(images);
    }
  })
});

app.listen(PORT, function(){
  console.log('Example app listening on port ' + PORT)
});

var fetchOptions = {
  disableRedirects: false
  // header: {
  //   'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36'
  // }
};
function getImages(reqUrl, cb) {
  var images = [];
  fetchUrl(reqUrl, fetchOptions, function(error, meta, body){
    var urls = getUrls(body.toString());
    urls.forEach(function(e){
      var srcUrl = url.parse(e);
      if (srcUrl.pathname.endsWith('.jpg')) {
        if (!srcUrl.host) {
            images.push(url.resolve(reqUrl, srcUrl));
          } else {
            images.push(url.format(srcUrl));
          }
      }
    });
    if (cb) {
      cb(null, images);
    } else {
      console.log(images);
    }
  });
}

function getUrls(text) {
  const ret = new Set();
  const add = function(url){
    ret.add(url.trim().replace(/\.+$/, ''));
  };

  const urls = text.match(urlRegex()) || [];
  for (const url of urls) {
    add(url);
  }

  var a = Array.from(ret);
  a = _.uniq(a);
  return a;
}

// var str = 'https://www.realmaeglerne.dk/Default.aspx?ID=10291&ProductID=20202168';
var str = 'https://www.realmaeglerne.dk/bolig/klynevej-17-snogebaek';
getImages(str);