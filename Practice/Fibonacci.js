"use strict"

function Fibonacci(n) {
  var fib = [ ]

  for(let i = 0; i < n; i++) {
    if(i === 0 || i === 1) {
      fib.push(1)
    } else {
      var sum = fib[i - 2] + fib[i - 1]
      fib.push(sum)
    }
  }

  return fib[n - 1]
}

console.log(Fibonacci(7) === 13);
console.log(Fibonacci(1) === 1);
console.log(Fibonacci(9) === 34);

var remember = {}
function memFib(n) {
  if (n === 1 || n === 2) return 1;

  if(remember[n]) {
    return remember[n];
  } else {
    remember[n] = memFib(n - 2) + memFib(n - 1);
  }

  return remember[n];
}

console.log(memFib(7) === 13);
console.log(memFib(1) === 1);
console.log(memFib(9) === 34);
