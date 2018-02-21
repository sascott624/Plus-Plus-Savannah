"use strict"

function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

function BreadthFirstSearch(callback, root) {
  var queue = [];
  queue.push(root);
  var found = false;
  
  while(queue.length > 0 && !found) {
    var current = queue.shift()

    if(callback(current.val)) {
      found = current.val;
    } else {
      if(current.left) {
        queue.push(current.left);
      }
      
      if(current.right) {
        queue.push(current.right);
      }
    }    
  }

  return found;
}

var a = new TreeNode(7);
var b = new TreeNode(4);
var c = new TreeNode(9);
var d = new TreeNode(1);
var e = new TreeNode(3);
var f = new TreeNode(10);
var g = new TreeNode(2);
var h = new TreeNode(8);
var i = new TreeNode(6);
var j = new TreeNode(5);

a.left = b;
a.right = c;
b.left = d;
b.right = e;
c.left = f;
c.right = g;
d.left = h;
d.right = i;
e.left = j;


/* our tree looks like this:

             7
          /    \
        4       9
      /  \     /  \
    1     3   10  2
  /  \   /
 8   6  5

*/

var root = a;

var divisibleByThree = (val) => {
  if(val % 3 === 0) {
    return val;
  } else {
    return false;
  }
}

var divisibleByFive = (val) => {
  if(val % 5 === 0) {
    return val;
  } else {
    return false;
  }
}

var firstTest = {
  expected: 9,
  BFS: BreadthFirstSearch(divisibleByThree, root)
}

var secondTest = {
  expected: 10,
  BFS: BreadthFirstSearch(divisibleByFive, root)
}


console.log(firstTest.BFS === firstTest.expected);
console.log(secondTest.BFS === secondTest.expected);
