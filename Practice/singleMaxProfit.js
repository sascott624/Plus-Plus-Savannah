"use strict"

function singleMaxProfit(array) {
  var min = null;
  var maxProfit = null;

  for(const price of array) {
    if(min === null) {
      min = price;
      continue;
    }

    if(maxProfit === null || price - min > maxProfit) {
      maxProfit = price - min;
    }

    if(price < min) {
      min = price;
    }
  }

  return maxProfit;
}


console.log(singleMaxProfit([ 7, 1, 5, 3, 6, 4 ]) === 5);
console.log(singleMaxProfit([ 7, 2, 5, 14, 1, 12 ]) ===12);
console.log(singleMaxProfit([ 10, 7, 14, 18, 3 ]) === 11);
console.log(singleMaxProfit([ 5, 4, 3, 2, 1 ]) === -1);
console.log(singleMaxProfit([ 13, 2, 4, 9, 21, 18 ]) === 19);
