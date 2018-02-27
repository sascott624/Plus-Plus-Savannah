"use strict"

function Node(value) {
  this.val = value;
  this.children = [];
}

function textingTrie() {
  var root = new Node("root");
  var input = [];

  function traverseTrie() {
    var answer = [];
    var queue = [];
    queue.push(root);
    var current = true;

    while(current && queue.length > 0) {
      current = queue.shift();
      if(current.children.length > 0) {
        for(const child of current.children) {
          if(child) {
            queue.push(child);
          }
        }
      }
      answer.push(current.val);
    }

    return answer;
  }

  function searchChildren(current, index, value) {
    if(current.children.length === 0 || index >= current.children.length) {
      return false;
    }

    if(current.children[index].val === value) {
      return current.children[index];
    }

    if(current.children[index].val > value) {
      var next = (2 * index) + 1;
      return searchChildren(current, next, value);
    }

    if(current.children[index].val < value) {
      var next = (2 * index) + 2;
      return searchChildren(current, next, value);
    }

    return false;
  }

  function insertChild(current, index, value) {
    if(!current.children[index]) {
      var newNode = new Node(value);
      current.children[index] = newNode;
      return newNode;
    }

    if(current.children[index].val > value) {
      var next = (2 * index) + 1;
      return insertChild(current, next, value);
    }

    if(current.children[index].val < value) {
      var next = (2 * index) + 2;
      return insertChild(current, next, value);
    }
  }


  function addWord(inputString, current) {
    if(!current) {
      current = root;
    }

    for(let i = 0; i <= inputString.length; i++) {
      var letter;
      if(i === inputString.length) {
        letter = '$';
      } else {
        letter = inputString.charAt(i);
      }

      var exists = searchChildren(current, 0, letter);
      if(exists) {
        current = exists;
      } else {
        var inserted = insertChild(current, 0, letter);
        current = inserted;
      }
    }
  }

  return {
    insert: function(word) {
      addWord(word);
    },
    type: function(letter) {
      input.push(letter);
      var suggestion = 'suggest word';
      return suggestion;
    },
    delete: function() {
      input.pop();
      var suggestion = 'suggest word';
      return suggestion;
    },
    search: function(value) {

    },
    listNodes: function() {
      return traverseTrie();
    }
  }
}

var trie = new textingTrie();
trie.insert('can');
trie.insert('cat');
trie.insert('car');
trie.insert('bat');
trie.insert('cash');
console.log(trie.listNodes().length === 16);
