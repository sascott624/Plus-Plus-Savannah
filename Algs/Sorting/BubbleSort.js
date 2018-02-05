"use strict"

function bubbleSort(array) {
  function swap (array, index1, index2) {
    var temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
  }

  var swapped;

  for(let i = 0; i < array.length - 1; i++) {
    swapped = false;
    for(let j = 0; j < array.length - 1; j++) {
      if(array[j] > array[j + 1]) {
        swap(array, j, j + 1);
        swapped = true;
      }
    }

    if(!swapped) {
      break;
    }
  }

  return array;
}

var firstArray = [ 8, 4, 2, 6, 7, 1, 5, 3 ];
var firstSort = bubbleSort(firstArray);
console.log(JSON.stringify(firstSort) === JSON.stringify([ 1, 2, 3, 4, 5, 6, 7, 8 ]));

var secondArray = [ 1, 2, 3, 5, 4, 6, 7, 8 ];
var secondSort = bubbleSort(secondArray);
console.log(JSON.stringify(secondSort) === JSON.stringify([ 1, 2, 3, 4, 5, 6, 7, 8 ]));

var thirdArray = [ 5, 4, 1, -3, 2 ];
var thirdSort = bubbleSort(thirdArray);
console.log(JSON.stringify(thirdSort) === JSON.stringify([ -3, 1, 2, 4, 5 ]));

var fourthArray = [ 7, 3, 0, 1, 0, 2, 3 ];
var fourthSort = bubbleSort(fourthArray);
console.log(JSON.stringify(fourthSort) === JSON.stringify([ 0, 0, 1, 2, 3, 3, 7 ]));
