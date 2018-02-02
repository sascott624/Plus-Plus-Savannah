"use strict"
/* also another one to try would be reversing an array of numbers without any temp variables or any other storage

Ideas:
- use stack (LIFO) --- but is this storage?
- swap first/last, swap second/penult, etc. --- but swapping requires a temp variable....
- array.push(array.shift()) --- BUT we need to save the initial array.length as a variable to dictate the duration of the loop

-- shifting/popping change the size of the array, freeing up "storage" space
*/

// **use addition/multiplication!

function cheatReverse(array) {
  for(let i = 0; i < array.length; i++) {
    array.splice(i, 0, array.pop())
  }
}

function reverse(array) {
  for(let i = 0; i < Math.floor(array.length / 2); i++) {
    array[array.length - 1 - i] = array[array.length - 1 - i] + array[i];
    array[i] = Math.abs(array[i] - array[array.length - 1 - i]);
    array[array.length - 1 - i] = array[array.length - 1 - i] - array[i]
  }
}

const firstArray = [ 6, 5, 4, 3, 2, 1 ];
reverse(firstArray);
console.log(JSON.stringify(firstArray) === JSON.stringify([ 1, 2, 3, 4, 5, 6 ]));

const secondArray = [ 12, 4, 2, 6, 16, 9, 1, 3, 2 ];
reverse(secondArray);
console.log(JSON.stringify(secondArray) === JSON.stringify([ 2, 3, 1, 9, 16, 6, 2, 4, 12 ]));

const thirdArray = [ 1, 1, 2, 3, 3, 3, 3 ];
reverse(thirdArray);
console.log(JSON.stringify(thirdArray) === JSON.stringify([ 3, 3, 3, 3, 2, 1, 1 ]));

const fourthArray = [ 5, 3 ];
reverse(fourthArray);
console.log(JSON.stringify(fourthArray) === JSON.stringify([ 3, 5 ]));
