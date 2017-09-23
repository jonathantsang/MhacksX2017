var key = require('../utils/key');
var request = require('request');
var _ = require('underscore');


// The Type Ahead API.
module.exports = function(req, res) {
  var term = req.query.text.trim();
  if (!term) {
    res.json([{
      title: '<i>(enter a search term)</i>',
      text: ''
    }]);
    return;
  }
  console.log(term);

  url ='http://api.wolframalpha.com/v2/query?input=' + term + '&output=JSON' + '&appid=' + key;
  console.log(url);
  request(url, function(err, response) {
    var data = JSON.parse(response.body);
    var datatype = data.queryresult.datatypes;
    if (datatype !== "Financial") {
      res.json([{
        title: '<i>(no results)</i>',
        text: ''
      }]);
      return;
    }
    if (err || response.statusCode !== 200 || !response.body) {
      console.log('Typeahead got error', err);
      res.status(500).send('Error');
      return;
    }
    console.log('Typeahead did not got error');

    var pods = data.queryresult.pods;
    var interpret = pods.find((obj) => {return obj.title==='Input interpretation'});
    var img = interpret.subpods[0].img.src
    console.log(img);
    if (!img) {
      res.json([{
        title: '<i>(no results)</i>',
        text: ''
      }]);
    } else {
      console.log('Success!');
      res.json([{
        title: '<img src='+img+'></img>',
        text: 'Stock'
      }]);
    }
  });

};