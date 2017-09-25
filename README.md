Mixmax Linking

stock graphs(slash-commands): https://wolframstocksearch.herokuapp.com/resolver
https://wolframstocksearch.herokuapp.com/typeahead

example: /stocks amzn aapl from july 2016 to december 2016

plotting(link-resolver): https://plotemailgraph.herokuapp.com/resolver

regex: 
```
plot(\([0-9]+,[0-9]+\))+
```

plot(0,0)(2,4)(5,6)

coinbase(link-resolver): https://cbinfo.herokuapp.com/resolver

regex: 
```
[a-zA-Z][a-zA-Z][a-zA-Z]
```

BTC, ETH, LTC

blackrock(slash-command): https://blackrockinfo.herokuapp.com/typeahead
https://blackrockinfo.herokuapp.com/resolver

/blackrock aapl
