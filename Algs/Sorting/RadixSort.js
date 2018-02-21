"use strict"

function RadixSort(array) {
  var buckets = [[]];
  var max = 0;
  var maxDigitLength = 0;
  var modulo = 10;
  var sigFig = 1;
  
  for(let i = 0; i < array.length; i++) {
    if(array[i] > max) {
      max = array[i];
    }    
  }
  
  maxDigitLength = max.toString().length;
  
  for(let i = 0; i < maxDigitLength; i++, modulo *= 10, sigFig *= 10) {
    for(let j = 0; j < array.length; j++) {
      var bucket = Math.floor((array[j] / sigFig) % modulo);
      if(!buckets[bucket]) {
        buckets[bucket] = [];
      }
      
      buckets[bucket].push(array[j]);
    }
    
    var index = 0;
    for(let k = 0; k < buckets.length; k++) {
      var value;
      if(buckets[k]) {
        value = buckets[k].shift();

        while(value) {
          array[index] = value;
          index += 1;
          value = buckets[k].shift();
        }
      }
    }
  }
}

var firstArray = [ 284, 12, 115, 47, 5, 39, 173, 60, 99, 251, 137, 17 ];
RadixSort(firstArray);
console.log(JSON.stringify(firstArray) === JSON.stringify([ 5, 12, 17, 39, 47, 60, 99, 115, 137, 173, 251, 284 ]));
