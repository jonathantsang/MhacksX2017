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
	var html = '<img style="max-width:100%;" src="' + image.url + '" width="' + width + '"/>';
    	res.json({
      	body: html
        // Add raw:true if you're returning content that you want the user to be able to edit
    });   
    console.log("sent");
}