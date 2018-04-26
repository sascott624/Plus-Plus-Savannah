"use strict"

function maxProfit(array) {
  var total = null;
  var min = null;
  var maxProfit = null;

  for(const price of array) {
    if(min === null) {
      min = price;
      continue;
    }

    if(maxProfit === null || price - min > maxProfit) {
      maxProfit = price - min;
    } else if(price - min < maxProfit) {
      total = total ? total + maxProfit : maxProfit;
      min = price;
      maxProfit = null;
      continue;
    }

    if(price < min) {
      min = price;
    }
  }

  if(maxProfit) {
    total = total ? total + maxProfit : maxProfit;
  }

  return total;
}

console.log(maxProfit([ 7, 1, 5, 3, 6, 4 ]) === 7);
console.log(maxProfit([ 10, 7, 14, 18, 3 ]) === 11);
console.log(maxProfit([ 5, 4, 3, 2, 1 ]) === -1);
console.log(maxProfit([ 13, 2, 4, 21, 9, 18 ]) === 28);
console.log(maxProfit([ 1, 2, 3, 4, 5 ]) === 4);
