function binaryTreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

function binaryTree() {
  var root = null;

  function insertNode(current, nodeToInsert) {
    if(current.val > nodeToInsert.val) {
      if(!current.left) {
        current.left = nodeToInsert;
      } else {
        return insertNode(current.left, nodeToInsert);
      }
    } else if(current.val < nodeToInsert.val) {
      if(!current.right) {
        current.right = nodeToInsert;
      } else {
        return insertNode(current.right, nodeToInsert);
      }
    }
  }

  function find(value) {
    var found = false;
    var current = root;
    var previous = null;

    while(!found && current) {
      if(current.val === value) {
        found = current;
      } else {
        if(value < current.val) {
          previous = current;
          current = current.left;
        } else if(value > current.val) {
          previous = current;
          current = current.right;
        }
      }
    }

    return { node: found, previous };
  }

  function traverse(current, callback) {
    var array = [];
    var min;

    function inOrderTraversal(currentNode, array) {
      if(currentNode) {
        array.push(currentNode.val);
        if(!min || min.val > currentNode.val) {
          min = currentNode;
        }

        if(currentNode.left) {
          inOrderTraversal(currentNode.left, array);
        }

        if(currentNode.right) {
          inOrderTraversal(currentNode.right, array);
        }
      }
    }

    inOrderTraversal(current, array);

    if(callback) {
      return callback(array, min);
    } else {
      return array;
    }
  }

// callback functions from traverse:
  function getCount(arr, smallestValueNode) {
    return arr.length;
  }

  function getMin(arr, smallestValueNode) {
    return smallestValueNode;
  }

  function toArray(arr, smallestValueNode) {
    return arr;
  }
// end callback functions

  function getHeight(current) {
    if(!current) {
        return -1;
    }

    return 1 + Math.max(getHeight(current.left), getHeight(current.right));
  }

  function remove(value) {
    var foundNodeAndParent = find(value);
    var node = foundNodeAndParent.node;
    var parent = foundNodeAndParent.previous;

    if(!node) {
      return false;
    }

    var side = parent.left === node ? 'left' : 'right';

    if(!node.left && !node.right) {
      parent[side] = null;
      return true;
    } else {
      if(node.left && !node.right) {
        parent[side] = node.left;
        return true;
      } else if(!node.left && node.right) {
        parent[side] = node.right;
        return true;
      } else if(node.left && node.right) {
        var min = traverse(node.right, getMin);
        remove(min.val);
        node.val = min.val;
        return true;
      }
    }
  }

  return {
    height: function() {
      var height = getHeight(root);
      return height;
    },
    insert: function(value) {
      var newNode = new binaryTreeNode(value);
      if(!root) {
        root = newNode;
      } else {
        insertNode(root, newNode);
      }
    },
    contains: function(value) {
      var foundNodeAndParent = find(value);
      return foundNodeAndParent.node ? true : false;
    },
    delete: function(value) {
      var deleted = remove(value);
      return deleted;
    },
    size: function() {
      var nodes = traverse(root, getCount);
      return nodes;
    },
    nodes: function() {
      var nodes = traverse(root, toArray);
      return nodes;
    }
  }
}

var binary = new binaryTree();
binary.insert(10);
console.log(binary.size() === 1);
binary.insert(5);
console.log(binary.size() === 2);
binary.insert(14);
binary.insert(1);
binary.insert(19);
binary.insert(7);
binary.insert(3);
binary.insert(4);
binary.insert(16);
binary.insert(27);
binary.insert(12);
console.log(binary.size() === 11);
console.log(binary.height() === 4);
console.log(binary.contains(19) === true);
console.log(binary.contains(100) === false);
binary.insert(100);
console.log(binary.size() === 12);
console.log(binary.contains(100) === true);
console.log(binary.delete(4) === true);
console.log(binary.size() === 11);
console.log(binary.delete(55) === false);
binary.delete(19);
console.log(binary.size() === 10);
console.log(binary.nodes());
binary.delete(14);
console.log(binary.nodes());
console.log(binary.height() === 3);
