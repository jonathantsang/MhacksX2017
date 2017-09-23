var key = require('../utils/key');
var request = require('request');
var _ = require('underscore');


// The API that returns the in-email representation.
module.exports = function(req, res) {
  var term = req.query.text.trim();
  console.log(term);
  handleSearchString(term, req, res);
};

function handleSearchString(term, req, res) {
  request({
    url: 'http://api.wolframalpha.com/v2/query?',
    qs: {
      input: term,
      appid: key,
      format: 'image,plaintext',
      output : 'JSON'
    },
    timeout: 15 * 1000
  }, function(err, response) {
    if (err) {
      res.status(500).send('Error');
      return;
    }

    var data = JSON.parse(response.body);

    var pods = data.queryresult.pods;
    var ph = pods.find((obj) => {return obj.title==='Price history'});
    var img = ph.subpods[0].img.src

    console.log(img);
    // Cap at 600px wide
    var width = '100%'
    var html = '<img style="max-width:100%;" src="' + img + '" width="' + width + '"/>';
    res.json({
      body: html
        // Add raw:true if you're returning content that you want the user to be able to edit
    });
  });
}