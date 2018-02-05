"use strict"

function insertionSort(array) {
  function swap (array, index1, index2) {
    var temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
  }
  
  function insert(array, index) {
    for(let j = index + 1; j >= 0; j--) {
      if(array[j] < array[j - 1]) {
        swap(array, j, j - 1);
      }
    }
  }

  for(let i = 0; i < array.length; i++) {
    insert(array, i);
  }

  return array;
}

var firstArray = [ 8, 4, 2, 6, 7, 1, 5, 3 ];
var firstSort = insertionSort(firstArray);
console.log(JSON.stringify(firstSort) === JSON.stringify([ 1, 2, 3, 4, 5, 6, 7, 8 ]));

var secondArray = [ 1, 2, 3, 5, 4, 6, 7, 8 ];
var secondSort = insertionSort(secondArray);
console.log(JSON.stringify(secondSort) === JSON.stringify([ 1, 2, 3, 4, 5, 6, 7, 8 ]));

var thirdArray = [ 5, 4, 1, -3, 2 ];
var thirdSort = insertionSort(thirdArray);
console.log(JSON.stringify(thirdSort) === JSON.stringify([ -3, 1, 2, 4, 5 ]));

var fourthArray = [ 7, 3, 0, 1, 0, 2, 3 ];
var fourthSort = insertionSort(fourthArray);
console.log(JSON.stringify(fourthSort) === JSON.stringify([ 0, 0, 1, 2, 3, 3, 7 ]));
