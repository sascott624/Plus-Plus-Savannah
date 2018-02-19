"use strict"

/* Binary Tree Postorder Traversal */

function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

function postorderTraversal(root) {
  var response = [];

  function traverse(node) {
    if(node.left) {
      traverse(node.left);
    }

    if(node.right) {
      traverse(node.right);
    }

    response.push(node.val);
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


var answer = postorderTraversal(d);
console.log(JSON.stringify(answer) === JSON.stringify([ 'A', 'C', 'B', 'E', 'G', 'F', 'D' ]))
