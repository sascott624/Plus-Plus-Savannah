"use strict"

function HeapSort(array) {
  var length = array.length;

  // build a max heap from the array:
  for(let i = Math.floor(length / 2); i >= 0; i--) {
    heapify(array, length, i)
  }
  /* now, array[0] is the largest element in the array/heap so we put it in its place (swap it with the last element in the array/heap)

  then, call heapify on the unsorted array to (once again) bubble up the largest element & sort it, etc. */
  for(let j = length - 1; j >= 0; j--) {
    swap(array, 0, j);
  
    heapify(array, j, 0)
  }
  
  function heapify(arr, length, rootIndex) {
    var maxIndex = rootIndex;
    var leftChildIndex = (2 * rootIndex) + 1;
    var rightChildIndex = (2 * rootIndex) + 2;
    
    if(leftChildIndex < length && arr[leftChildIndex] > arr[maxIndex]) {
      maxIndex = leftChildIndex
    }
    
    if(rightChildIndex < length && arr[rightChildIndex] > arr[maxIndex]) {
      maxIndex = rightChildIndex
    }
    
    if(maxIndex != rootIndex) {
      // swap so that the subHeap is correctly sorted:
      swap(arr, rootIndex, maxIndex);
      /* now, call heapify again bc our swapping only places the largest  
      element at the top of its subHeap, and not necessarily at the root position of the entire Heap */
      heapify(arr, length, maxIndex);
    }
  }
  
  function swap(arr, i, j) {
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

var firstArray = [ 7, 4, 1, 6, 9, 10, 2, 5, 8, 3 ];
HeapSort(firstArray);
console.log(JSON.stringify(firstArray) === JSON.stringify([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]));