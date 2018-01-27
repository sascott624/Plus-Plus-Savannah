"use strict";

function Node (value, previous) {
  return {
    value,
    previous
  }
}

function newStack() {
  var top = null;
  var count = 0;

  return {
    push: function(value) {
      count += 1;
      return top = new Node(value, top);
    },
    length: function() {
      return count;
    },
    pop: function() {
      var currentTop = top;
      if(top) {
        top = top.previous;
        count -= 1;
      }

      return currentTop;
    },
    getTop: function() {
      if(top) {
        return top.value;
      } else {
        return top;
      }
    }
  }
}

var stack = newStack();
console.log(stack.length() === 0);
stack.push('A');
console.log(stack.length() === 1);
stack.push('B');
console.log(stack.length() === 2);
stack.push('Z');
console.log(stack.getTop() === 'Z');
console.log(stack.length() === 3)
stack.pop();
console.log(stack.getTop() === 'B')
console.log(stack.length() === 2);
stack.pop()
console.log(stack.getTop() === 'A');
console.log(stack.length() === 1);
stack.pop();
console.log(stack.getTop() === null);
console.log(stack.length() === 0);
stack.pop()
console.log(stack.length() === 0);
stack.push('Q');
console.log(stack.length() === 1);
console.log(stack.getTop() === 'Q');
