var sources = [
	{
		name: 'CoinMarketCap',
		url: 'https://api.coinmarketcap.com/v1/ticker/litecoin/',
		homepage: 'https://coinmarketcap.com/currencies/litecoin/',
		currency: 'USD',
		getRate: function(data) {
			return data[0].price_usd;
		}
	},
	{
		name: 'Bitmarket.pl',
		url: 'https://www.bitmarket.pl/json/LTCPLN/ticker.json',
		homepage: 'https://www.bitmarket.pl/market.php?market=LTCPLN',
		currency: 'PLN',
		getRate: function(data) {
			return data.ask;
		}
	},
	{
		name: 'Bitmaszyna.pl',
		url: 'https://bitmaszyna.pl/api/LTCPLN/ticker.json',
		homepage: 'https://bitmaszyna.pl/',
		currency: 'PLN',
		getRate: function(data) {
			return data.ask;
		}
	},
	{
		name: 'BitBay',
		url: 'https://bitbay.net/API/Public/LTCPLN/ticker.json',
		homepage: 'https://bitbay.net',
		currency: 'PLN',
		getRate: function(data) {
			return data.ask;
		}
	},
	{
		name: 'Bitfinex',
		url: 'https://api.bitfinex.com/v1/pubticker/ltcusd',
		homepage: 'https://www.bitfinex.com/',
		currency: 'USD',
		getRate: function(data) {
			return data.ask;
		}
	},
	{
		name: 'Bitstamp',
		url: 'https://www.bitstamp.net/api/v2/ticker/ltcusd',
		homepage: 'https://www.bitstamp.net/',
		currency: 'USD',
		getRate: function(data) {
			return data.ask;
		}
	},
];

var currencyApiUrl = 'http://api.fixer.io';

var currencySymbols = {
	'USD': '$',  // US Dollar
	'EUR': '€',  // Euro
	'CZK': 'Kč', // Czech Coruna
	'GBP': '£',  // British Pound Sterling
	'ILS': '₪',  // Israeli New Sheqel
	'INR': '₹',  // Indian Rupee
	'JPY': '¥',  // Japanese Yen
	'KRW': '₩',  // South Korean Won
	'PHP': '₱',  // Philippine Peso
	'PLN': 'zł', // Polish Zloty
	'THB': '฿',  // Thai Baht
};

function getRate(source, currency, callback) {
	var source = typeof source === 'undefined' ? getSourceByName('CoinMarketCap') : getSourceByName(source);
	
	if(source === null) return false;
	
	request(source.url, function(req) {
		var data = JSON.parse(req.responseText);
		var rate = source.getRate(data);
		
		if(source.currency != currency) {
			convert(rate, source.currency, currency, callback);
			return;
		}
		
		callback(rate);
	});
	
	return true;
}

function getSourceByName(name) {
	for(var i = 0; i < sources.length; i++) {
		if(sources[i].name == name) {
			return sources[i];
		}
	}
	
	return null;
}

function getAllSources() {
	var sourceNames = [];
	
	for(var i = 0; i < sources.length; i++) {
		sourceNames.push(sources[i].name);
	}
	
	return sourceNames;
}

function getAllCurrencies() {
	var currencies = [];
	
	Object.keys(currencySymbols).forEach(function eachKey(key) {
		currencies.push(key);
	});
	
	return currencies;
}

function convert(value, from, to, callback) {
	request(currencyApiUrl + '/latest?base=' + from, function(req) {
		var data = JSON.parse(req.responseText);
		var rate = data.rates[to];
		
		callback(value * rate);
	});
}

function request(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = (function(xhr) {
		return function() {
			callback(xhr);
		}
	})(xhr);
	xhr.open('GET', url, true);
	xhr.send('');
}
