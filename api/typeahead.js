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

  request({
    url: 'http://api.wolframalpha.com/v2/query?',
    qs: {
      input: term,
      appid: key
    },
    output: 'JSON',
    format: 'image',
    timeout: 10 * 1000
  }, function(err, response) {
    if (err || response.statusCode !== 200 || !response.body || !response.body.data) {
      res.status(500).send('Error');
      return;
    }

    var results = response.body.data;
    console.log(results == null);
    console.log(JSON.parse(results));
    if (results.length === 0) {
      res.json([{
        title: '<i>(no results)</i>',
        text: ''
      }]);
    } else {
      res.json(results);
    }
  });

};