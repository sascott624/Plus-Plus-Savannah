"use strict"
var request = require('request');
var cheerio = require('cheerio');

function Node(value, parent) {
  this.val = value;
  this.parent = parent;
  this.children = [];
  
  this.hasChild = function(value) {
    if(value === '$') {
      return this.isWordEnd();
    } else {
      var index = 0;
      var found = false;

      while(index < this.children.length && !found) {
        var child = this.children[index];
        if(child.val === value) {
          found = child;
        }

        index += 1;
      }

      return found;
    }
  }
  
  this.isWordEnd = function() {
    var containsStop = this.children[0] && this.children[0].val === '$';
    return containsStop;
  }
}

function wikiTrie() {
  var root = new Node("root", null);
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

      var exists = current.hasChild(letter);
      if(exists) {
        current = exists;
      } else {
        var newNode = new Node(letter, current);
        current.children.push(newNode);
        current = newNode;
      }
    }
  }

  function suggestWord(inputString) {
    var initialWord;

    if(!inputString) {
      initialWord = input;
    } else {
      initialWord = inputString.split('');
    }

    var suggestion = '';
    var current = root;

    for(const letter of initialWord) {
      var exists = current.hasChild(letter);

      if(exists) {
        suggestion += exists.val;
        current = exists;
      } else {
        return autocorrect();
        break;
      }
    }

    if(current.children[0] && current.children[0].val === '$') {
      return 'No suggestion needed: ' + suggestion + ' is a valid word!';
    } else {
      var fullSuggestion = autocomplete(current, suggestion)
      if(inputString) {
        return fullSuggestion;
      } else {
        return "You typed '" + input.join('') + "'; Perhaps you want to type '" + fullSuggestion + "'?";        
      }
    }
  }

  function autocomplete(currentNode) {
    var queue = [];
    var stop = false;

    for(const child of currentNode.children) {
      queue.push(child);
    }

    while(queue.length > 0 && !stop) {
      var current = queue.shift();
      if(current.val === '$') {
        stop = current.parent;
      } else {
        for(const child of current.children) {
          queue.push(child);
        }
      }
    }
    
    var suggestion = backtraceWord(stop)

    return suggestion;
  }

  function autocorrect() {
    var resultNodes = levenshteinSearch(1);

    if(resultNodes.length === 0) {
      return "Your input '" + input.join('') + "' is not a valid word, and does not match any suggestions in our dictionary";
    }
    
    var results = [];
    
    for(const node of resultNodes) {
      var word = backtraceWord(node);

      if(node.isWordEnd()) {
        results.push(word);
      } else {
        var finalWord = suggestWord(word);
        if(!results.includes(finalWord)) {
          results.push(finalWord)
        }
      }
    }

    return "Your input '" + input.join('') + "' is not a valid word. Perhaps you meant one of these:\n-" + results.join('\n-');
  }
  
  function levenshteinSearch(maxCost) {
    if(!maxCost) {
      maxCost = 1;
    }
    var currentRow = range(input.length + 1);
    var results = [];
    
    function matrixEDSearch(node, previousRow, maxCost) {
      // example: 'cat'         c  a  t
      // previousRow =     [ 0, 1, 2, 3 ]
      // currentRow =    b [ 1, 1, 2, 3 ]
      //                 i [ 2, 2, 2, 2 ]
      //                 t [ 3, 3, 2, ]
      
      var columnCount = input.length + 1;
      var currentRow = [previousRow[0] + 1]; // [ 2, 2,]
      // initial row compared to null
      var remainder = range(1, columnCount); // [ 1, 2, 3 ]
      // range takes care of the remaining comparisons

      for(let i = 0; i < remainder.length; i++) {
        var column = remainder[i];
        var insertCost = currentRow[column - 1] + 1;
        var removeCost = previousRow[column] + 1;
        var swapCost = (input[column - 1] !== node.val) ? previousRow[column - 1] + 1 : previousRow[column - 1];
        
        currentRow.push(Math.min(insertCost, removeCost, swapCost));
      }
      
      if(currentRow[currentRow.length - 1] <= maxCost) {
        results.push(node);
      }
      
      if(Math.min.apply(Math, currentRow) <= maxCost) {
        for(const childNode of node.children) {
          matrixEDSearch(childNode, currentRow, maxCost);
        }
      }
    }
    
    for(const node of root.children) {
      if(node.val === '$') {
        continue
      }

      matrixEDSearch(node, currentRow, maxCost);
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
    type: function(inputString) {
      if(inputString.length === 1) {
        input.push(inputString);
      } else {
        input = inputString.split('');
      }

      var suggestion = suggestWord();
      return suggestion;
    },
    delete: function() {
      input.pop();
      var suggestion = suggestWord();
      return suggestion;
    },
    reset: function() {
      input = [];
      console.log('Input reset.');
    },
    listNodes: function() {
      return traverseTrie();
    }
  }
}

async function scraper() {

  function parseWiki(url) {
    return request(url, function(error, response, html) {
      var input = [];
      
      if(!error) {
        var $ = cheerio.load(html);

        var header = $('#firstHeading').text()
        input.push(header)
        $('.mw-parser-output').filter(function() {
          var data = $(this);
          
          var children = data.children('p');

          data.children('p').map(function(index, element) {
            input.push($(this).text());
          });
        })
      }
      console.log(input[0])
      return input;
    })
  }
  
  return {
    scrape: function(url) {
      var response = parseWiki(url);
      return response;
    }
  }
}

var trie = new wikiTrie();
var scraper = new scraper();
var penguins;
scraper.scrape('https://en.wikipedia.org/wiki/Penguin');
console.log(penguins[0]);


