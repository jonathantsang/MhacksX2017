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

  var type = "";

  console.log(term);
  var split = term.split(" ")
  if (split.length !== 1) {

    if (split[1].toLowerCase() == "from") {
      split.splice(1, 0, "stock");
      type = "fromTo";
    }
  } else {
    type = "default";
  }
  term = split.join('+');

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

    try {
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