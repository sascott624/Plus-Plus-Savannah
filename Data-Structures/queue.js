"use strict";

function Node (value, next) {
  return {
    value,
    next
  }
}

function newQueue() {
  var front = null;
  var rear = null;
  var count = 0;

  return {
    enqueue: function(value) {
      var newNode = new Node(value, null);

      if(count > 0) {
        rear.next = newNode;
      } else {
        front = newNode;
      }

      count += 1;
      rear = newNode
      return rear;
    },
    length: function() {
      return count;
    },
    dequeue: function() {
      if(count > 0) {
        front = front.next;
        count -= 1;
      } else {
        return null;
      }
    },
    getRear: function() {
      return rear ? rear.value : null;
    },
    getFront: function() {
      return front ? front.value : null;
    }
  }
}

var queue = newQueue();
console.log(queue.length() === 0);
queue.enqueue('A');
console.log(queue.length() === 1);
queue.enqueue('B');
console.log(queue.length() === 2);
console.log(queue.getFront() === 'A');
console.log(queue.getRear() === 'B');
queue.enqueue('C');
queue.enqueue('D');
queue.enqueue('E');
queue.enqueue('F');
console.log(queue.length() === 6);
console.log(queue.getRear() === 'F');
queue.dequeue();
queue.dequeue();
console.log(queue.length() === 4);
console.log(queue.getFront() === 'C');
console.log(queue.getRear() === 'F');
queue.dequeue();
queue.dequeue();
queue.dequeue();
queue.dequeue();
console.log(queue.length() === 0);
queue.dequeue();
console.log(queue.length() === 0);
queue.enqueue('Z');
console.log(queue.getFront() === 'Z');
console.log(queue.getRear() === 'Z');
