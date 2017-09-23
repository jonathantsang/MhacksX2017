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

  console.log("IN TERM: ", term);

  /* Finding out what kind of input it is */
  var spt = term.split(" ")
  if (spt.length !== 1) {

    /* found "From"  */
    if (spt.indexOf("from") !== -1) {
      // spt.splice(1, 0, "stock");
      type = "fromTo";
    } else if (spt.indexOf(',') !== -1 || spt.indexOf('|') !== -1 || spt.indexOf('and') !== -1) {
      type = "multiDefault";
    }
  } else {
    type = "default";
  }
  term = spt.join('+');
  console.log("OUT TERM:", term);

  /* Calling Wolfram API now */
  url ='http://api.wolframalpha.com/v2/query?input=' + term + '&output=JSON' + '&appid=' + key;
  console.log("URL: ", url);
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
        
        /* DEFAULT: ONE STOCK */
        if (type === "default") {
    
          var ph = pods.find((obj) => {return obj.title==='Price history'});
          var img = ph.subpods[0].img.src;
    
          console.log(img);
          if (!img) {
            res.json([{
              title: '<i>(no results)</i>',
              text: ''
            }]);
          } else {
            console.log('Successful ', type);
            res.json([{
              title: '<img src='+imgint+'></img>',
              text: img
            }]);
          }

        /* FROMTO: from Date to Date */
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
            console.log('Successful ', type);
            res.json([{
              title: '<img src='+imgint+'></img>',
              text: img
            }]);
          }

        /* MULTIDEFAULT: multiple stocks */
        } else if (type === "multiDefault") {
          var rph = pods.find((obj) => {return obj.title==='Relative price history'});
          var img = ph.subpods[0].img.src;
          console.log(img);
          if (!img) {
            res.json([{
              title: '<i>(no results)</i>',
              text: ''
            }]);
          } else {
            console.log('Successful ', type);
            res.json([{
              title: '<img src='+imgint+'></img>',
              text: img
            }]);
          }

        /* Oh no something went wrong */
        } else {
          console.log('??? something happen');
          res.json([{
            title: '<i>(no results)</i>',
            text: ''
          }]);
        }
    } catch(err) {
      console.log("Error! ", err);
      res.json([{
        title: '<i>(no results)</i>',
        text: ''
      }]);
    }
  });

};