"use strict"

function mergeSort(array) {
  function divide(arr) {
    if(arr.length < 2) {
      return arr
    }

    var middle = Math.floor(arr.length / 2);
    var left = arr.slice(0, middle);
    var right = arr.slice(middle);

    return merge(divide(left), divide(right));
  }

  function merge(left, right) {
    var total = left.length + right.length
    var newArray = [];

    for(let i = 0; i < total; i++) {
      if(left[0] <= right[0] || left.length >= 1 && right.length === 0) {
        newArray.push(left.shift())
      } else if(right[0] < left[0] || right.length >= 1 && left.length === 0){
        newArray.push(right.shift())
      }
    }

    return newArray;
  }

  return divide(array);
}

var firstArray = [ 8, 4, 2, 6, 7, 1, 5, 3 ];
var firstSort = mergeSort(firstArray);
console.log(JSON.stringify(firstSort) === JSON.stringify([ 1, 2, 3, 4, 5, 6, 7, 8 ]));

var secondArray = [ 1, 2, 3, 5, 4, 6, 7, 8 ];
var secondSort = mergeSort(secondArray);
console.log(JSON.stringify(secondSort) === JSON.stringify([ 1, 2, 3, 4, 5, 6, 7, 8 ]));

var thirdArray = [ 5, 4, 1, -3, 2 ];
var thirdSort = mergeSort(thirdArray);
console.log(JSON.stringify(thirdSort) === JSON.stringify([ -3, 1, 2, 4, 5 ]));

var fourthArray = [ 7, 3, 0, 1, 0, 2, 3 ];
var fourthSort = mergeSort(fourthArray);
console.log(JSON.stringify(fourthSort) === JSON.stringify([ 0, 0, 1, 2, 3, 3, 7 ]));
