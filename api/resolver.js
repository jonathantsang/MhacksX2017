var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');

//The API that returns the in-email representation.
module.exports = function(req, res) {
  console.log("resolver");
  var term = req.query.text.trim();
  console.log(term);
  handleSearchString(term, req, res);
};


function handleSearchString(term, req, res){   
    res.json( {"body": "kys"});
    console.log("sent");
}