"use strict";

function Node (val, next) {
  return {
    val: val,
    next: next
  }
}

function newLinkedList () {
  var head = null;

  return {
    push: function (val) {
      var findLast = (current) => {
        if(current.next) {
          return findLast(current.next);
        } else {
          return current;
        }
      }

      if(head) {
        findLast(head).next = new Node(val, null);
      } else {
        head = new Node(val, null);
      }
    },
    remove: function (val) {
      var find = (current, previous, thingToFind) => {
        if(current) {
          if(current.val === thingToFind) {
            return { current, previous }
          } else {
            return find(current.next, current, thingToFind);
          }
        } else {
          return { current: null, previous }
        }
      }

      var found = find(head, null, val);
      if(found.current) {
        if(found.previous) {
          found.previous.next = found.current.next;
        } else {
          head = found.current.next;
        }
        return true;
      } else {
        return false;
      }
    },
    length: function () {
      var count = (current) => {
        if(!current) {
          return 0;
        } else {
          return 1 + count(current.next);
        }
      }
      return count(head);
    }
  }
}

var linkedList = newLinkedList();
// console.log(linkedList);
console.log(linkedList.length() === 0)
linkedList.push('A')
console.log(linkedList.length() === 1)
linkedList.push('B')
console.log(linkedList.length() === 2)
linkedList.push('C')
console.log(linkedList.length() === 3)
linkedList.push('D')
linkedList.push('E')
linkedList.push('F')
linkedList.push('G')
linkedList.push('H')
linkedList.push('I')
linkedList.push('J')
console.log(linkedList.length() === 10)
var didRemove = linkedList.remove('Z')
console.log(didRemove === false);
console.log(linkedList.length() === 10)
didRemove = linkedList.remove('J')
console.log(didRemove === true);
console.log(linkedList.length() === 9)
didRemove = linkedList.remove('E')
console.log(didRemove === true);
console.log(linkedList.length() === 8)
didRemove = linkedList.remove('A')
console.log(didRemove === true);
console.log(linkedList.length() === 7)
