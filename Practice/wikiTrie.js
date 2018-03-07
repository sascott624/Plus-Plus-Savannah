"use strict"
const input = require('input');

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

  function addWord(inputString, articleId, index) {
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
        return "No suggestion needed: '" + suggestion + "' is a valid word!";
      }
    } else {
      var autocompleted = autocomplete(current);
      if(suggestFromAutocorrect) {
        return autocompleted;
      } else {
        return "You typed '" + inputString + "'; Perhaps you want to type '" + autocompleted + "'."
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

      if(getMinHeight(node) > 2) {
        continue;
      }

      if(node.val === '$') {
        results.push(word);
      } else {
        var finalWord = suggestWord(word, input.length);

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

  function getMinHeight(current) {
    var minHeight;

    if(!current || !current.children) {
      return 0;
    }

    if(current.children["$"]) {
      return 1;
    }

    var children = [];


    for(const child in current.children) {
      children.push(1 + getMinHeight(current.children[child]));
    }

    return Math.min.apply(Math, children);

  }

  // function searchTrie(searchTerm) {
  //   var inputArray;
  //   var response = '';
  //   var autocorrected = false;
  //
  //   if(searchTerm.includes(' ')) {
  //     inputArray = searchTerm.split(' ');
  //   } else {
  //     inputArray = [ searchTerm ];
  //   }
  //
  //   function find(word) {
  //     var current = root;
  //     var found = false;
  //     var articles;
  //
  //     for(let i = 0; i <= word.length; i++) {
  //       var letter;
  //       if(i === word.length) {
  //         letter = '$';
  //       } else {
  //         letter = word.charAt(i);
  //       }
  //
  //       var exists = current.children[letter];
  //       if(exists) {
  //         if(letter === '$') {
  //           found = backtraceWord(exists.parent);
  //           articles = exists.children;
  //         } else {
  //           current = current.children[letter];
  //         }
  //       } else {
  //         autocorrected = autocorrect(word, true);
  //         return find(autocorrected);
  //       }
  //     }
  //
  //     return { word: found, articles: articles };
  //   }
  //
  //   var foundTerms = [ ];
  //   var foundArticles = [ ];
  //
  //   for(var word of inputArray) {
  //     var foundWordAndArticles = find(word);
  //     foundTerms.push(foundWordAndArticles.word);
  //     foundArticles.push(foundWordAndArticles.articles);
  //   }
  //
  //   if(foundTerms.length === 1 && foundArticles.length === 1) {
  //     var sorted = [ ];
  //
  //     for(const article in foundArticles[0]) {
  //       sorted.push([input[article].title, foundArticles[0][article].length]);
  //       sorted.sort(function(a,b){
  //         return b[1] - a[1]
  //       })
  //     }
  //
  //     if(autocorrected) {
  //       response += "Keyword '" + word + "' is not a valid search term. Showing results instead for '" + autocorrected + "':"
  //     } else {
  //       response += "Keyword(s) '" + word + "' appear(s) in the following article(s):"
  //     }
  //
  //     for(const item of sorted) {
  //       response += '\n-' + item[0] + ' (' + item[1] + ')'
  //     }
  //   } else {
  //     var commonArticles = [ ]
  //
  //     for(const article in foundArticles[0]) {
  //       for(let i = 1; i < foundArticles.length; i++) {
  //         if(foundArticles[i][article]) {
  //           commonArticles.push(article)
  //         }
  //       }
  //     }
  //
  //     if(foundTerms.length > 1) {
  //       response += "Your search "
  //     } else {
  //       response += "Keyword "
  //     }
  //
  //     response += "'" + foundTerms.join(' ') + "' appears in the following article(s):"
  //
  //     for(const article of commonArticles) {
  //       var title = input[article].title
  //       response += '\n-' + title
  //     }
  //   }
  //
  //   return response;
  // }

  return {
    insert: function(word, article, indexOfWordAtArticle) {
      addWord(word, article, indexOfWordAtArticle);
    },
    getSuggestion: function(inputString) {
      return suggestWord(inputString);
    },
    listNodes: function() {
      return traverseTrie();
    }
  }
}

function parseInput(t, data) {
  for(const item in data) {
    var paragraph = data[item]["text"];
    paragraph = paragraph.toLowerCase();
    var array = paragraph.split(' ');

    var parsed = array.map(word =>
      word.replace(/([^a-zA-Z])/, "")
    )

    for(let i = 0; i < parsed.length; i++) {
      var word = parsed[i];
      t.insert(word, item, i);
    }
  }
}

var trie = new Trie();
parseInput(trie, input);
console.log(trie.getSuggestion('sha'));
console.log(trie.getSuggestion('gill'));
console.log(trie.getSuggestion('ict'));
console.log(trie.getSuggestion('met'));
console.log(trie.getSuggestion('app'));
console.log(trie.getSuggestion('fis'));
// console.log(trie.search("fish"));
// console.log(trie.search("bird"));
// console.log(trie.search("fsh"));
// console.log(trie.search("birds fish"));
// console.log(trie.search("city italy"));
// console.log(trie.search("sweet"));
// console.log(trie.search("icte"));
// console.log(trie.search("snoww"));
// console.log(trie.search("tree"));
