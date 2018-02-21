"use strict"

function BinarySearch(array, value) {
  var found = false;
  
  function search(arr, start, end) {
    if(found || start === end) {
      return;
    }

    var midpoint = Math.floor((start + end) / 2)

    if(arr[midpoint] === value) {
      found = arr[midpoint];
      return;
    } else {
      if(arr[midpoint] < value) {
        search(arr, midpoint, end)
      } else if(arr[midpoint] > value) {
        search(arr, start, midpoint)
      }
    }
  }
  
  search(array, 0, array.length - 1)
  return found;
}

var firstArray = [ 20, 30, 40, 50, 80, 90, 100 ];
console.log(BinarySearch(firstArray, 40) === 40);
console.log(BinarySearch(firstArray, 10) === false);