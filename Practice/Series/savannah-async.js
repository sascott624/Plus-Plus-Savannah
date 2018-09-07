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
    var executionStatusObj = { };

    function iterate() {
      for(const funcName of allFuncNames) {
        // if we already have the result of the current function or execution of the current function is pending, continue
        if(results[funcName] || executionStatusObj[funcName]) {
          continue;
        }

        function done(err, result) {
          executionStatusObj[funcName] = err ? 'err' : 'executed';
          results[funcName] = result;

          var executedFuncs = allFuncNames.filter(func => executionStatusObj[func] === 'executed')

          if(executedFuncs.length === allFuncNames.length) {
            cb(null, results);
          } else {
            iterate();
          }
        }

        var originalFunc;
        var originalArry;

        if(typeof(funcObject[funcName]) === 'function') {
          originalFunc = funcObject[funcName];

          executionStatusObj[funcName] = 'pending';
          originalFunc(done);
        } else {
          originalArry = funcObject[funcName];

          let j = 0;

          while(originalFunc === undefined) {
            if(typeof(originalArry[j]) === 'string') {
              results[originalArry[j]] ? j += 1 : originalFunc = false;
            } else {
              originalFunc = originalArry[j];
              executionStatusObj[funcName] = 'pending';
              originalFunc(results, done);
            }
          }
        }
      }
    }

    iterate();
  },
  promiseSeries: function(arrayOfFuncs, cb) {
    var previous;

    for(let i = arrayOfFuncs.length-1; i >= 0; i --) {
      var promisifiedFunc = promisify(arrayOfFuncs[i]);
      if (i === arrayOfFuncs.length - 1) {
        promisifiedFunc.then(function() {
          cb();
        });
      } else {
        promisifiedFunc.then(function() {
          previous()
        });
      }
      previous = promisifiedFunc;
    }

    previous();
  },
  promiseParallel: function(arrayOfFuncs, cb) {
    Promise.all(arrayOfFuncs.map(promisify))
      .then(function(val) { cb(null, val); })
      .catch(function(err) { cb(err) });

  },
  promiseAuto: function(funcObject, cb) {

  }
}
