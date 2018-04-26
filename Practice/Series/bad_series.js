var callWhenDone = function(err) {
	if (err) {
		console.log('ERROR', err);
	} else {
		console.log('SUCCESS');
	}
}

var doItInSeries = function (callback) {
	callFirst(function (err) {
		if (err) return callback(err);
		thenCallSecond(function (err) {
			if (err) return callback(err);
			thenCallThird(function (err) {
				if (err) return callback(err);
				thenFourth(function (err) {
					if (err) return callback(err);
					finallyAtTheVeryEnd(function (err) {
						if (err) return callback(err);
						console.log('we are now done');
						callback();
					})
				});
			});
		});
	});
}

doItInSeries(callWhenDone);
