"use strict"

/* Binary Tree Preorder Traversal */

function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

function preorderTraversal(root) {
  var response = [];

  function traverse(node) {
    response.push(node.val);

    if(node.left) {
      traverse(node.left, node);
    }

    if(node.right) {
      traverse(node.right, node);
    }
  }

  traverse(root);
  return response;
}

var a = new TreeNode('A');
var b = new TreeNode('B');
var c = new TreeNode('C');
var d = new TreeNode('D');
var e = new TreeNode('E');
var f = new TreeNode('F');
var g = new TreeNode('G');

d.left = b;
b.left = a;
b.right = c;
d.right = f;
f.left = e;
f.right = g;


var answer = preorderTraversal(d);
console.log(JSON.stringify(answer) === JSON.stringify([ 'D', 'B', 'A', 'C', 'F', 'E', 'G' ]));
