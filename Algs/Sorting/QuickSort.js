"use strict"

function quickSort(array) {
  function swap(arr, index1, index2) {
    var temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
  }

  function divideAndSort(arr) {
    if(arr.length < 2) {
      return arr;
    }

    var low = 0;
    var high = arr.length - 1;
    var pivot = arr[arr.length - 1];

    var j = 0;
    for(let i = low; i < high; i++) {
      if(arr[i] <= pivot) {
        swap(arr, j, i)
        j += 1;
      }
    }

    swap(arr, j, arr.length - 1);
    return divideAndSort(arr.slice(0, j)).concat(divideAndSort(arr.slice(j)));
  }

  return divideAndSort(array);
}


var firstArray = [ 8, 4, 2, 6, 7, 1, 5, 3 ];
var firstSort = quickSort(firstArray);
console.log(JSON.stringify(firstSort) === JSON.stringify([ 1, 2, 3, 4, 5, 6, 7, 8 ]));

var secondArray = [ 1, 2, 3, 5, 4, 6, 7, 8 ];
var secondSort = quickSort(secondArray);
console.log(JSON.stringify(secondSort) === JSON.stringify([ 1, 2, 3, 4, 5, 6, 7, 8 ]));

var thirdArray = [ 5, 4, 1, -3, 2 ];
var thirdSort = quickSort(thirdArray);
console.log(JSON.stringify(thirdSort) === JSON.stringify([ -3, 1, 2, 4, 5 ]));

var fourthArray = [ 7, 3, 0, 1, 0, 2, 3 ];
var fourthSort = quickSort(fourthArray);
console.log(JSON.stringify(fourthSort) === JSON.stringify([ 0, 0, 1, 2, 3, 3, 7 ]));
