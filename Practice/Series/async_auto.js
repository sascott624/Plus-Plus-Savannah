"use strict"

// var async = require('async');
var async = require('./savannah-async.js');

var callWhenDone = function(err) {
	if (err) {
		console.log('ERROR', err);
	} else {
		console.log('SUCCESS');
	}
}

var autoCalculate = function (first, second, callback) {
	async.auto({

		firstTimesFive: function(done) {
			setTimeout(function() {
				console.log('firstTimesFive', first*5);
				done(false, first*5);
			}, 3000);
		},

		secondMinusTwo: function(done) {
			console.log('secondMinusTwo', second-2);
			done(false, second-2);
		},

		sumTheResult: ['firstTimesFive', 'secondMinusTwo', function(results, done) {
			console.log('sumTheResult', results.firstTimesFive + results.secondMinusTwo);
			done(false, results.firstTimesFive + results.secondMinusTwo);
		}],

		squareIt: ['sumTheResult', function(results, done) {
			setTimeout(function() {
				console.log('squareIt', results.sumTheResult*results.sumTheResult);
				done(false, results.sumTheResult*results.sumTheResult);
			}, 3000);
		}]

	}, function(err, results) {
		console.log(results.squareIt);
		callback(err);
	});

}

autoCalculate(2, 5, callWhenDone);
