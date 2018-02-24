"use strict"

function binaryTreeNode(data) {
  this.val = data;
  this.left = null;
  this.right = null;
}

function binaryTree() {
  var root = null;

  function getHeight(current) {
    if(!current) {
      return 0;
    }

    return 1 + Math.max(getHeight(current.left), getHeight(current.right));
  }

  function insertNode(current, nodeToInsert) {
    if(nodeToInsert.val > current.val) {
      if(!current.right) {
        current.right = nodeToInsert;
      } else {
        return insertNode(current.right, nodeToInsert);
      }
    }

    if(nodeToInsert.val < current.val) {
      if(!current.left) {
        current.left = nodeToInsert;
      } else {
        return insertNode(current.left, nodeToInsert);
      }
    }
  }

  function find(current, valueToFind) {
    if(!current) {
      return false;
    }

    if(current.val === valueToFind) {
      return true;
    } else {
      if(valueToFind > current.val) {
        return find(current.right, valueToFind);
      } else if(valueToFind < current.val) {
        return find(current.left, valueToFind);
      }
    }
  }

  function removeRoot(valueToRemove) {
    if(!root.left && !root.right) {
      root = null;
      return;
    } else if(root.left && !root.right) {
      root = root.left;
      return;
    } else if(root.right && !root.left) {
      root = root.right;
      return;
    } else {
      var min = getMin(root.right);
      removeNode(root, min.val);
      root.val = min.val;
      return;
    }
  }

  function removeNode(current, valueToRemove) {
    // we've already checked that the node to remove is NOT the root - so, we only care about each node's children
    if(!current || (!current.left && !current.right)) {
      return false;
    }

    var rmv;

    if(current.left && current.left.val === valueToRemove) {
      rmv = 'left';
    } else if(current.right && current.right.val === valueToRemove) {
      rmv = 'right';
    }

    if(rmv) {
      if(!current[rmv].left && !current[rmv].right) {
        current[rmv] = null;
        return;
      } else if(current[rmv].left && current[rmv].right) {
        var min = getMin(current[rmv].right);
        if(min.val === current[rmv].right.val) {
          current[rmv].right = null;
        } else {
          removeNode(current[rmv].right, min.val);
        }

        current[rmv].val = min.val;
        return;
      } else {
        var side = current[rmv].left ? 'left' : 'right';
        current[rmv] = current[rmv][side];
        return;
      }
    } else {
      if(valueToRemove > current.val) {
        return removeNode(current.right, valueToRemove);
      } else if(valueToRemove < current.val) {
        return removeNode(current.left, valueToRemove);
      }
    }
  }

  function getMin(current) {
    if(!current.left) {
      return current;
    } else {
      return getMin(current.left);
    }
  }

  function traverseInOrder() {
    var array = [];

    function traverse(current) {
      if(!current){
        return;
      }

      if(current.left) {
        traverse(current.left)
      }

      array.push(current.val);

      if(current.right) {
        traverse(current.right);
      }
    }

    traverse(root);
    return array;
  }

  function traversePreOrder() {
    var array = [];

    function traverse(current) {
      if(!current){
        return;
      }

      array.push(current.val);

      if(current.left) {
        traverse(current.left);
      }

      if(current.right) {
        traverse(current.right);
      }
    }

    traverse(root);
    return array;
  }

  function traversePostOrder() {
    var array = [];

    function traverse(current) {
      if(!current){
        return;
      }

      if(current.left) {
        traverse(current.left);
      }

      if(current.right) {
        traverse(current.right);
      }

      array.push(current.val);
    }

    traverse(root);
    return array;
  }

  function BFS(testFunc) {
    var queue = [];
    queue.push(root);
    var found = false;

    while(queue.length > 0 && !found) {
      var current = queue.shift()

      if(testFunc(current.val)) {
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

  function DFS(testFunc) {
    var stack = [];
    stack.push(root);
    var found = false;

    while(stack.length > 0 && !found) {
      var current = stack.pop()

      if(testFunc(current.val)) {
        found = current.val;
      } else {
        if(current.right) {
          stack.push(current.right);
        }

        if(current.left) {
          stack.push(current.left);
        }
      }
    }

    return found;
  }

  var divByThree = (value) => {
    if(value % 3 === 0) {
      return true;
    }

    return false;
  }

  return {
    size: function() {
      var nodesInOrder = traverseInOrder();
      return nodesInOrder.length;
    },
    contains: function(value) {
      var isFound = find(root, value);
      return isFound;
    },
    insert: function(value) {
      var newNode = new binaryTreeNode(value);

      if(!root) {
        root = newNode;
      } else {
        insertNode(root, newNode);
      }
    },
    remove: function(value) {
      var removed;
      if(!root) {
        removed = false;
      } else if(root && root.val === value) {
        removed = removeRoot(value);
      } else {
        removed = removeNode(root, value);
      }

      return removed;
    },
    height: function() {
      var treeHeight = getHeight(root);
      return treeHeight;
    },
    toArray: function() {
      var nodesInOrder = traverseInOrder();
      return nodesInOrder;
    },
    inOrderTraversal: function() {
      var nodesInOrder = traverseInOrder();
      return nodesInOrder;
    },
    preOrderTraversal: function() {
      var nodesInOrder = traversePreOrder();
      return nodesInOrder;
    },
    postOrderTraversal: function() {
      var nodesInOrder = traversePostOrder();
      return nodesInOrder;
    },
    getRoot: function() {
      return root.val;
    },
    depthFirstSearch: function() {
      return DFS(divByThree);
    },
    breadthFirstSearch: function() {
      return BFS(divByThree);
    }
  }
}

/* Tree:
            14
          /    \
        8       21
      /  \     /  \
    5     9   17  24
  /  \     \   \
1    6     10  20

*/

var binaryTree = new binaryTree();
console.log(binaryTree.size() === 0);
console.log(binaryTree.height() === 0);
binaryTree.insert(10);
console.log(binaryTree.height() === 1);
binaryTree.insert(7);
binaryTree.insert(4);
console.log(binaryTree.height() === 3);
binaryTree.insert(5);
console.log(binaryTree.size() === 4);
binaryTree.insert(1);
binaryTree.insert(14);
binaryTree.remove(10);
console.log(JSON.stringify(binaryTree.inOrderTraversal()) === JSON.stringify([ 1, 4, 5, 7, 14 ]));
console.log(binaryTree.getRoot() === 14);
binaryTree.insert(21);
binaryTree.insert(17);
binaryTree.insert(24);
binaryTree.insert(20);
console.log(binaryTree.contains(1) === true);
console.log(binaryTree.contains(9) === false);
binaryTree.insert(9);
console.log(binaryTree.contains(9) === true);
console.log(JSON.stringify(binaryTree.inOrderTraversal()) === JSON.stringify([1, 4, 5, 7, 9, 14, 17, 20, 21, 24]));
console.log(JSON.stringify(binaryTree.preOrderTraversal()) === JSON.stringify([14, 7, 4, 1, 5, 9, 21, 17, 20, 24]));
console.log(JSON.stringify(binaryTree.postOrderTraversal()) === JSON.stringify([1, 5, 4, 9, 7, 20, 17, 24, 21, 14]));
console.log(binaryTree.remove(100) === false);
binaryTree.remove(4);
console.log(JSON.stringify(binaryTree.inOrderTraversal()) === JSON.stringify([1, 5, 7, 9, 14, 17, 20, 21, 24]));
binaryTree.insert(6);
binaryTree.insert(10);
binaryTree.insert(8);
binaryTree.remove(7);
console.log(JSON.stringify(binaryTree.inOrderTraversal()) === JSON.stringify([1, 5, 6, 8, 9, 10, 14, 17, 20, 21, 24]));
console.log(binaryTree.height() === 4);
console.log(binaryTree.depthFirstSearch() === 6);
console.log(binaryTree.breadthFirstSearch() === 21);
