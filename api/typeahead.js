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

  /* Type of input */
  var type = "";

  console.log(term);

  var spt = term.split(" ")
  if (spt.length !== 1) {
    if (spt.find("from")) {
      // spt.splice(1, 0, "stock");
      type = "fromTo";
    }
  } else {
    type = "default";
  }
  term = spt.join('+');
  console.log(term);

  url ='http://api.wolframalpha.com/v2/query?input=' + term + '&output=JSON' + '&appid=' + key;
  console.log(url);
  request(url, function(err, response) {
    var data = JSON.parse(response.body);
    var datatype = data.queryresult.datatypes;
    var success = data.queryresult.success;
    var error = data.queryresult.success;
    if (datatype !== "Financial" || !success) {
      console.log("Query failed: not financial data or unsuccessful query");
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
    console.log('Typeahead did not get error');

    try {
        console.log(type);
        var pods = data.queryresult.pods;
        var interpret = pods.find((obj) => {return obj.title==='Input interpretation'});
        var imgint = interpret.subpods[0].img.src
        
        if (type === "default") {
          console.log(type);
    
          var ph = pods.find((obj) => {return obj.title==='Price history'});
          var img = ph.subpods[0].img.src;
    
          console.log(img);
          if (!img) {
            res.json([{
              title: '<i>(no results)</i>',
              text: ''
            }]);
          } else {
            console.log('Success!');
            res.json([{
              title: '<img src='+imgint+'></img>',
              text: img
            }]);
          }
        } else if (type === "fromTo") {
          console.log(type);
          var hist = pods.find((obj) => {return obj.title==='History'});
          var img = hist.subpods[0].img.src;
          console.log(img);
          if (!img) {
            res.json([{
              title: '<i>(no results)</i>',
              text: ''
            }]);
          } else {
            console.log('Success!');
            res.json([{
              title: '<img src='+imgint+'></img>',
              text: img
            }]);
          }
        }
    } catch(err) {
      console.log(err);
      res.json([{
        title: '<i>(no results)</i>',
        text: ''
      }]);
    }
  });

};