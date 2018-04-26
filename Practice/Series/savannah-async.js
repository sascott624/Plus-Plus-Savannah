"use strict"

module.exports = {
  series: function(arrayOfFuncs, cb) {
    var executedCount = 0;

    function done() {
      executedCount === arrayOfFuncs.length ? cb() : iterate();
    }

    function iterate() {
      var funcToExecute = arrayOfFuncs[executedCount];
      executedCount += 1;
      funcToExecute(done);
    }

    iterate();
  },
  parallel: function(arrayOfFuncs, cb) {
    var executedCount = 0;

    function done() {
      executedCount += 1;

      if(executedCount === arrayOfFuncs.length) {
        cb();
      }
    }

    for(const funcToExecute of arrayOfFuncs) {
      funcToExecute(done);
    }
  },
  auto: function(funcObject, cb) {
    var results = { };
    var allFuncNames = Object.keys(funcObject).slice();

    var parallelCount = 0;
    var parallelFuncs = allFuncNames.filter(f => typeof(funcObject[f]) === 'function' );

    var seriesCount = 0;
    var seriesFuncs = allFuncNames.filter(f => !parallelFuncs.includes(f));

    for(const parallelFunc of parallelFuncs) {
      function parallelDone(err, result) {
        results[parallelFunc] = result;
        parallelCount += 1;

        if(parallelCount === parallelFuncs.length) {
          performSeriesFuncs();
        }
      }

      funcObject[parallelFunc](parallelDone);
    }

    function performSeriesFuncs() {
      var seriesFuncName = seriesFuncs[seriesCount];
      var seriesFuncArray = funcObject[seriesFuncName];

      function seriesDone(err, result) {
        if(err) {
          console.log('ERR: ' + err);
        } else {
          results[seriesFuncName] = result;
          seriesCount += 1;

          if(seriesCount !== seriesFuncs.length) {
            performSeriesFuncs();
          }
        }
      }

      for(const paramOrFunc of seriesFuncArray) {
        if(typeof(paramOrFunc) === 'string' && !results[paramOrFunc]) {
          seriesDone(new Error('dependent function not completed'));
          return;
        } else {
          if(typeof(paramOrFunc) === 'function') {
            paramOrFunc(results, seriesDone);
          }
        }
      }
    }
  }
}
