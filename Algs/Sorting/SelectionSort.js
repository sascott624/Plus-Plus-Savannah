"use strict"

function selectionSort(array) {
  function swap (array, index1, index2) {
    var temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
  }

  for(let i = 0; i < array.length; i++) {
    var indexOfMin = i;

    for(let j = i + 1; j < array.length; j++) {
      if(array[j] < array[indexOfMin]) {
        indexOfMin = j;
      }
    }

    swap(array, i, indexOfMin);
  }

  return array;
}

var firstArray = [ 8, 4, 2, 6, 7, 1, 5, 3 ];
var firstSort = selectionSort(firstArray);
console.log(JSON.stringify(firstSort) === JSON.stringify([ 1, 2, 3, 4, 5, 6, 7, 8 ]));

var secondArray = [ 1, 2, 3, 5, 4, 6, 7, 8 ];
var secondSort = selectionSort(secondArray);
console.log(JSON.stringify(secondSort) === JSON.stringify([ 1, 2, 3, 4, 5, 6, 7, 8 ]));

var thirdArray = [ 5, 4, 1, -3, 2 ];
var thirdSort = selectionSort(thirdArray);
console.log(JSON.stringify(thirdSort) === JSON.stringify([ -3, 1, 2, 4, 5 ]));

var fourthArray = [ 7, 3, 0, 1, 0, 2, 3 ];
var fourthSort = selectionSort(fourthArray);
console.log(JSON.stringify(fourthSort) === JSON.stringify([ 0, 0, 1, 2, 3, 3, 7 ]));
