"use strict"

const input = require('input');

function InvertedIndex() {
  var index = { }

  function insertInput(stem, article, loc) {
    if(!index[stem]) {
      index[stem] = { }
    }

    if(!index[stem][article]) {
      index[stem][article] = [ ]
    }

    index[stem][article].push(loc)
  }

  function parseAndSearch(inputString) {
    var strict = inputString.charCodeAt(0) === 34 || inputString.charCodeAt(0) === 39;
    var inputArray = inputString.split(' ');
    inputArray = inputArray.map(str => {
      return str.replace(/([^a-zA-Z])/, "")
    })

    var indexResults = { };

    for(const word of inputArray) {
      var stem = getStem(word);
      indexResults[word] = index[stem];
    }

    return compareResults(inputArray, indexResults, strict);
  }

  function compareResults(inputArray, results, isStrict) {
    var response = ''
    var articleCounts = { }
    var commonArticles = [ ]

    for(const word in results) {
      for(const article in results[word]) {
        if(!articleCounts[article]) {
          articleCounts[article] = 0;
        }

        articleCounts[article] += 1;
      }
    }

    for(const id in articleCounts) {
      if(articleCounts[id] === Object.keys(results).length) {

        for(const word in results) {
          for(const article in results[word]) {
            if(article === id) {
              var indices = results[word][article];

              if(isStrict) {
                commonArticles.push({ word: word, indices: indices, article: article })
              } else {
                if(commonArticles.indexOf(article) < 0) {
                  commonArticles.push(article);
                }
              }
            }
          }
        }
      }
    }

    if(isStrict) {
      var sortedCommonArticles = [ ];
      var mins = [ ];
      var sorted = false;

      for(const article of commonArticles) {
        var index = article.indices.shift();
        mins.push({ word: article.word, index: index, article: article.article })
      }

      while(!sorted) {
        var minimum = null;
        var word = null;
        var article = null;
        var indexToReplace = null;

        for(let i = 0; i < mins.length; i++) {
          var min = mins[i];

          if(min) {
            if(!minimum || min.index < minimum) {
              minimum = min.index;
              word = min.word
              article = min.article
              indexToReplace = i;
            }
          } else {
            sorted = true;
          }
        }

        if(!minimum) {
          sorted = true;
        } else {
          sortedCommonArticles.push({ word: word, index: minimum, article: article });
          var replace = commonArticles[indexToReplace]
          mins[indexToReplace] = { word: replace.word, index: replace.indices.shift(), article: replace.article }
        }
      }

      var strictCommonArticles = [ ]

      for(let i = 0; i < sortedCommonArticles.length; i++) {
        var length = inputArray.length;

        for(let j = 0; j < length; j++) {
          var baseIndex = sortedCommonArticles[i].index;

          if(sortedCommonArticles[j + i].word === inputArray[j] && sortedCommonArticles[j + i].index === baseIndex + j) {
            if(j === length - 1) {
              var article = sortedCommonArticles[j].article
              if(strictCommonArticles.indexOf(article) < 0) {
                strictCommonArticles.push(article);
              }
            } else {
              continue;
            }
          } else {
            break;
          }
        }
      }

      if(strictCommonArticles.length > 0) {
        response += "Your strict search '" + inputArray.join(' ') + "' appears in the following articles:"
      }

      for(const common of strictCommonArticles) {
        response += "\n-" + input[common].title
      }
    } else {
      response = "Your search '" + inputArray.join(' ') + "' appears in the following articles:"

      for(const common of commonArticles) {
        response += "\n-" + input[common].title
      }
    }

    return response;
  }

  return {
    insert: function(input, articleId, index) {
      insertInput(input, articleId, index);
    },
    search: function(input) {
      return parseAndSearch(input);
    }
  }
}

function getStem(word) {
  var endings = [ "ing", "est", "ies:y", "ier:y", "ied:y", "ly", "ed", "er", "s" ]
  var newWord;

  for(var end of endings) {
    var colon = end.indexOf(":")
    var replacement;

    if(colon > 0) {
      replacement = end.slice(colon + 1);
      end = end.slice(0, colon);
    } else {
      replacement = null;
    }

    var wordEnd = word.slice(end.length * -1)
    if(wordEnd === end) {
      if(end === "s" && word.slice(end.length * -2) === "ss") {
        return word;
      }

      newWord = word.slice(0, end.length * -1)

      if(colon && replacement) {
        newWord += replacement
      }
      break;
    }
  }

  if(!newWord) {
    newWord = word
  }

  return newWord;
}

function parseInput(invertedIndex, data) {
  for(const item in data) {
    var paragraph = data[item]["text"];
    paragraph = paragraph.toLowerCase();
    var array = paragraph.split(' ');

    var parsed = array.map(word =>
      word.replace(/([^a-zA-Z])/, "")
    )

    for(let i = 0; i < parsed.length; i++) {
      var word = parsed[i];
      var stem = getStem(word);
      invertedIndex.insert(stem, item, i);
    }
  }
}


var index = new InvertedIndex();
// getStem('skiing');
// getStem('dogs');
// getStem('sharks');
// getStem('highly')
parseInput(index, input);
// index.lookup('fish');

console.log(index.search('tree'));
console.log(index.search('lemon, tree'));
console.log(index.search('lemon tree'));
// console.log(index.search('apple tree'));
// console.log(index.search('white shark'));
// console.log(index.search('sharks'));
