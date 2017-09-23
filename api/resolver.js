var key = require('../utils/key');
var request = require('request');
var _ = require('underscore');


// The API that returns the in-email representation.
module.exports = function(req, res) {
  var term = req.query.text.trim();
  handleSearchString(term, req, res);
};

function handleSearchString(term, req, res) {
  request({
    url: 'http://api.wolframalpha.com/v2/query?input=' + encodeURIComponent(id) + '&appid=',
    qs: {
      input: term,
      appid: key
    },
    format : 'JSON',
    timeout: 15 * 1000
  }, function(err, response) {
    if (err) {
      res.status(500).send('Error');
      return;
    }

    var data = response.body.data;

    // Cap at 600px wide
    var width = data.image_width > 600 ? 600 : data.image_width;
    var html = '<img style="max-width:100%;" src="' + data.image_url + '" width="' + width + '"/>';
    res.json({
      body: html
        // Add raw:true if you're returning content that you want the user to be able to edit
    });
  });
}