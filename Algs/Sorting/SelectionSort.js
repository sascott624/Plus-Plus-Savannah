"use strict"

function selectionSort(array) {
  function swap (arr, index1, index2) {
    var temp = array[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
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
}

var firstArray = [ 8, 4, 2, 6, 7, 1, 5, 3 ];
selectionSort(firstArray);
console.log(JSON.stringify(firstArray) === JSON.stringify([ 1, 2, 3, 4, 5, 6, 7, 8 ]));

var secondArray = [ 1, 2, 3, 5, 4, 6, 7, 8 ];
selectionSort(secondArray);
console.log(JSON.stringify(secondArray) === JSON.stringify([ 1, 2, 3, 4, 5, 6, 7, 8 ]));

var thirdArray = [ 5, 4, 1, -3, 2 ];
selectionSort(thirdArray);
console.log(JSON.stringify(thirdArray) === JSON.stringify([ -3, 1, 2, 4, 5 ]));

var fourthArray = [ 7, 3, 0, 1, 0, 2, 3 ];
selectionSort(fourthArray);
console.log(JSON.stringify(fourthArray) === JSON.stringify([ 0, 0, 1, 2, 3, 3, 7 ]));
