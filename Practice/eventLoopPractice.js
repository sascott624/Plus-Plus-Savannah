
console.log('start');
console.log('middle');
var a = 1;
doFunc();
console.log('end');
var b = a + 3;

function doFunc() {
  console.log('doFunc');
  function goAgain() {
    console.log('again');
  }

  goAgain();
}






console.log('start');
setTimeout(function() {
  console.log('middle');
}, 0);
console.log('end');




function firstFunc(cb) {
  console.log('start')
  cb()
  console.log('end')
}

function callback() {
  console.log('callback');
}


firstFunc(callback);

(function IIFE() {
  // do something
})();



function IIFE() {
  // do something
}
IIFE();
