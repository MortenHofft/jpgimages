const express = require('express');
const app = express();
const url = require('url');
const getUrls = require('get-urls');
var fetchUrl = require("fetch").fetchUrl;

app.get('/', function(req, res){
  res.send('Hello World!')
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

app.listen(80, function(){
  console.log('Example app listening on port 3000!')
});

function getImages(reqUrl, cb) {
  var images = [];
  fetchUrl(reqUrl, function(error, meta, body){
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
    }
  });
}