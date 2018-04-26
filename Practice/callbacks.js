
var items = [ 1, 2, 3];

function secondFunc(arrayOfInts, cb) {
  for(var int of arrayOfInts) {
    int = int * 3;
  }

  cb(arrayOfInts);
}

function firstFunc(items, cb) {
  for(var int of items) {
    int = int + 1;
  }

  cb(items);
}

function thirdFunc(result) {
  console.log(result);
}

function startFunc() {
  firstFunc(items, function(resultingItems) {
    setTimeout(function () {
      secondFunc(resultingItems, function(thirdResult) {
        thirdFunc(thirdResult);
      }, 500)
    })
    console.console.log();
  });
}


startFunc()


/*------------------------*/



function keeperFunc(funcOne, funcTwo, cb) {
  var completed = 0;
  funcOne(function() {
    completed += 1;
    if(completed === 2) {
      cb();
    }
  });

  funcTwo(function() {
    completed += 1;
    if(completed === 2) {
      cb();
    }
  });
}

function startFunc(cb) {
  keeperFunc(firstFunc, secondFunc, function () {
    thirdFunc
  })
}
