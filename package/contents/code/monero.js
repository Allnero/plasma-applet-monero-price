var sources = [
	{
		name: 'BW',
		url: 'https://www.bw.com/exchange/config/controller/website/pricecontroller/getassistprice',
		homepage: 'https://www.bw.com/',
		currency: 'USD',
		getRate: function(data) {
			return data.datas.usd.xmr;
		}
	},
];

var currencyApiUrl = 'http://api.fixer.io';

var currencySymbols = {
	'USD': '$',  // US Dollar
	//'EUR': '€',  // Euro
	//'CZK': 'Kč', // Czech Coruna
	//'GBP': '£',  // British Pound Sterling
	//'ILS': '₪',  // Israeli New Sheqel
	//'INR': '₹',  // Indian Rupee
	//'JPY': '¥',  // Japanese Yen
	//'KRW': '₩',  // South Korean Won
	//'PHP': '₱',  // Philippine Peso
	//'PLN': 'zł', // Polish Zloty
	//'THB': '฿',  // Thai Baht
};

function getRate(source, currency, callback) {
	var source = typeof source === 'undefined' ? getSourceByName('BW') : getSourceByName(source);
	
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
