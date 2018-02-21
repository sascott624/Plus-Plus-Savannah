"use strict"

function TreeNode(val) {
  this.val = val;
  this.children = [ ];
}

// arbitrarily deciding to give a max child count of 4

function genericTree() {
  var root;

  function insertNode(node) {
    if(!root) {
      root = node;
      return;
    }

    var inserted = false;
    var queue = [];
    var current = root;

    while(!inserted) {
      for(let i = 0; i < 4; i++) {
        if(!current.children[i]) {
          current.children[i] = node;
          inserted = true;
          break;
        } else {
          queue.push(current.children[i]);
        }
      }

      current = queue.shift();
    }
  }

  function traverse(current, callback) {
    var array = [];

    function treeTraversal(currentNode) {
      if(currentNode) {
        array.push(currentNode.val);

        if(currentNode.children && currentNode.children.length > 0) {
          for(let i = 0; i < currentNode.children.length; i++) {
            treeTraversal(currentNode.children[i]);
          }
        }
      }
    }

    treeTraversal(current);

    if(callback) {
      return callback(array);
    } else {
      return array;
    }
    // console.log('----------')
    // console.log(array);
    // console.log('----------')
  }

  function getCount(arrayOfNodes) {
    var length = arrayOfNodes.length;
    return length;
  }

  function find(value, callback) {
    var found = false;
    var current = root;
    var parent = null;
    var queue = [];

    while(!found && current) {
      if(current.val === value) {
        found = current;
      } else {
        for(let i = 0; i < 4; i++) {
          if(current.children[i]) {
            if(current.children[i].val === value) {
              found = current.children[i];
              parent = current;
            } else {
              queue.push(current.children[i]);
            }
          }
        }
        current = queue.shift();
      }
    }

    if(callback) {
      return { node: found, parent: parent };
    } else {
      return found;
    }
  }

  function remove(value) {
    var foundNodeAndParent = find(value, true);
    var node = foundNodeAndParent.node;
    var parent = foundNodeAndParent.parent;

    if(!node) {
      return false;
    }

    var queueOfOrphans = [];

    for(let i = 0; i < 4; i++) {
      if(node.children[i]) {
        queueOfOrphans.push(node.children[i]);
      }
    }

    if(parent) {
      var indexOfNode = parent.children.indexOf(node);
      parent.children[indexOfNode] = null;
    } else {
      root = null;
    }

    while(queueOfOrphans.length > 0) {
      var orphan = queueOfOrphans.shift();
      insertNode(orphan);
    }
  }

  return {
    insert: function(value) {
      var newNode = new TreeNode(value);
      insertNode(newNode);
    },
    delete: function(value) {
      var deleted = remove(value);
      return deleted ? true : false;
    },
    contains: function(value) {
      var found = find(value, null);
      return found ? true : false;
    },
    size: function() {
      var nodes = traverse(root, getCount);
      return nodes;
    },
    getRootVal: function() {
      return root.val;
    }
  }
}

var tree = new genericTree;
tree.insert('a');
console.log(tree.size() === 1);
tree.insert('b');
console.log(tree.size() === 2);
tree.insert('c');
tree.insert('d');
tree.insert('e');
console.log(tree.size() === 5);
tree.insert('f');
tree.insert('g');
tree.insert('h');
console.log(tree.size() === 8);
console.log(tree.contains('a') === true);
console.log(tree.contains('f') === true);
console.log(tree.contains('i') === false);
tree.delete('d');
console.log(tree.size() === 7);
tree.delete('a');
console.log(tree.size() === 6);
console.log(tree.getRootVal() === 'b');
