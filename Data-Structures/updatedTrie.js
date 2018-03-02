"use strict"

function Node(value, parent) {
  this.val = value;
  this.parent = parent;
  this.children = { };
}

function Trie() {
  var root = new Node("root", null);

  function traverseTrie() {
    var answer = [];
    var queue = [];
    queue.push(root);
    var current = true;

    while(current && queue.length > 0) {
      current = queue.shift();
      if(Object.keys(current.children).length > 0) {
        for(const child in current.children) {
          queue.push(current.children[child]);
        }
      }
      answer.push(current.val);
    }

    return answer;
  }

  function addWord(inputString) {
    var currentNode = root;

    for(let i = 0; i <= inputString.length; i++) {
      var letter;
      if(i === inputString.length) {
        letter = '$';
      } else {
        letter = inputString.charAt(i);
      }

      var exists = currentNode.children[letter];
      if(exists) {
        currentNode = exists;
      } else {
        var newNode = new Node(letter, currentNode);
        currentNode.children[letter] = newNode;
        currentNode = newNode;
      }
    }
  }

  function suggestWord(inputString, suggestFromAutocorrect = false) {
    var suggestion = '';
    var current = root;

    for(const letter of inputString) {
      var exists = current.children[letter];

      if(exists) {
        suggestion += exists.val;
        current = exists;
      } else {
        return autocorrect(inputString);
      }
    }

    if(current.children['$']) {
      if(suggestFromAutocorrect) {
        return suggestion;
      } else {
        return 'No suggestion needed: ' + suggestion + ' is a valid word!';
      }
    } else {
      var fullSuggestion = autocomplete(current, suggestion);
      if(suggestFromAutocorrect) {
        return fullSuggestion;
      } else {
        return "You typed '" + inputString + "'; Perhaps you want to type '" + fullSuggestion + "'?";
      }
    }
  }

  function autocomplete(current) {
    var queue = [];
    var stop = false;

    for(const child in current.children) {
      queue.push(current.children[child]);
    }

    while(queue.length > 0 && !stop) {
      var current = queue.shift();
      if(current.val === '$') {
        stop = current.parent;
      } else {
        for(const child in current.children) {
          queue.push(current.children[child]);
        }
      }
    }

    var suggestion = backtraceWord(stop)

    return suggestion;
  }

  function autocorrect(input) {
    var resultNodes = levenshteinSearch(input, 1);

    if(resultNodes.length === 0) {
      return "Your input '" + input + "' is not a valid word, and does not match any suggestions in our dictionary";
    }

    var results = [ ];

    for(const node of resultNodes) {
      var word = backtraceWord(node);

      if(node.val === '$') {
        results.push(word);
      } else {
        var finalWord = suggestWord(word, true);

        if(results.indexOf(finalWord) < 0) {
          results.push(finalWord)
        }
      }
    }

    return "Your input '" + input + "' is not a valid word. Perhaps you meant one of these:\n-" + results.join('\n-');
  }

  function levenshteinSearch(word, maxCost) {
    if(!maxCost) {
      maxCost = 1;
    }
    var currentRow = range(word.length + 1);
    var results = [];

    function matrixEDSearch(node, previousRow, maxCost) {
      // example: 'cat'         c  a  t
      // previousRow =     [ 0, 1, 2, 3 ]
      // currentRow =    b [ 1, 1, 2, 3 ]
      //                 i [ 2, 2, 2, 2 ]
      //                 t [ 3, 3, 2,  ]

      var columnCount = word.length + 1;
      var currentRow = [previousRow[0] + 1];
      var remainder = range(1, columnCount); // [ 1, 2, 3 ]
      // remainder takes care of the remaining comparisons (ignoring first comparison to null input)

      for(let i = 0; i < remainder.length; i++) {
        var column = remainder[i];
        var insertCost = currentRow[column - 1] + 1;
        var removeCost = previousRow[column] + 1;
        var swapCost = (word.charAt(column - 1) !== node.val) ? previousRow[column - 1] + 1 : previousRow[column - 1];

        currentRow.push(Math.min(insertCost, removeCost, swapCost));
      }

      if(currentRow[currentRow.length - 1] <= maxCost) {
        results.push(node);
      }

      if(Math.min.apply(Math, currentRow) <= maxCost) {
        for(const child in node.children) {
          matrixEDSearch(node.children[child], currentRow, maxCost);
        }
      }
    }

    for(const node in root.children) {
      if(root.children[node].val === '$') {
        continue
      }

      matrixEDSearch(root.children[node], currentRow, maxCost);
    }

    return results;
  }

  function backtraceWord(endNode) {
    var word = ''

    var stack = [];
    var current = endNode;

    while(current) {
      stack.push(current.val)
      if(current.parent.val === 'root') {
        current = null;
      } else {
        current = current.parent;
      }
    }

    while(stack.length > 0) {
      word += stack.pop();
    }

    return word;
  }

  function range(start, end) {
    var range = [];

    if(!end) {
      end = start;
      start = 0;
    }

    for(let i = start; i < end; i++) {
      range.push(i);
    }

    return range;
  }

  return {
    insert: function(word) {
      addWord(word);
    },
    getSuggestion: function(inputString) {
      return suggestWord(inputString);
    },
    listNodes: function() {
      return traverseTrie();
    }
  }
}

var trie = new Trie();

trie.insert('can');
console.log(trie.listNodes());
trie.insert('cat');
trie.insert('car');
trie.insert('bit');
trie.insert('bite');
trie.insert('canteloupe');
trie.insert('cash');
trie.insert('dear');
trie.insert('carpenter');
// console.log(trie.listNodes());
console.log(trie.getSuggestion('c'));
console.log(trie.getSuggestion('ca'));
console.log(trie.getSuggestion('can'));
console.log(trie.getSuggestion('cant'));
console.log(trie.getSuggestion('b'));
console.log(trie.getSuggestion('ba'));
console.log(trie.getSuggestion('bat'));
console.log(trie.getSuggestion('crt'));
console.log(trie.getSuggestion('dar'));
