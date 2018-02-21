"use strict"

function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

function DepthFirstSearch(callback, root) {
  var current = root;
  var found = false;
  
  function traverse(current) {
    if(!current || found) {
      return;
    }

    if(callback(current.val)) {
      found = current.val;
      return;
    } else {
      traverse(current.left);
    
      traverse(current.right);
    }
  }
  
  traverse(root);
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
  expected: 6,
  DFS: DepthFirstSearch(divisibleByThree, root)
}

var secondTest = {
  expected: 5,
  DFS: DepthFirstSearch(divisibleByFive, root)
}

console.log(firstTest.DFS === firstTest.expected);
console.log(secondTest.DFS === secondTest.expected);
