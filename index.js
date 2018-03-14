const express = require('express');
const app = express();
const url = require('url');
const getUrls = require('get-urls');
var fetchUrl = require("fetch").fetchUrl;
const PORT = process.env.PORT || 5000;

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};
app.use(allowCrossDomain);

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

app.listen(PORT, function(){
  console.log('Example app listening on port ' + PORT)
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