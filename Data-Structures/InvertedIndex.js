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
    var strict = inputString.indexOf(',') < 0 && inputString.indexOf(' ') > 0;
    var inputArray;

    if(!strict && inputString.indexOf(',') > 0) {
      inputArray = inputString.split(', ');
    } else {
      inputArray = inputString.split(' ');
    }

    var indexResults = { }

    for(let i = -0; i < inputArray.length; i++) {
      var word = inputArray[i]
      var stem = getStem(word)

      if(stem === "preposition") {
        inputArray[i] = "preposition"
      } else {
        indexResults[word] = index[stem]
      }
    }
    
    inputArray = inputArray.filter(entry => {
      return entry !== "preposition"
    })

    var results = compareResults(inputArray, indexResults, strict);
    var response = "Your " + (results.strict ? "strict " : "") + "search '" + inputString
    
    if(results.commonArticles.length === 0) {
      response += "' did not yield any search results."
    } else {
      response += "' appears in the following articles:"

      for(const common of results.commonArticles) {
        response += "\n-" + input[common].title
      }
    }

    return response
  }

  function compareResults(searchTerms, results, isStrict) {
    var articleCounts = { }
    var commonArticles = [ ]
    var strictCommonArticles = { }

    for(const stem in results) {
      for(const articleId in results[stem]) {
        if(!articleCounts[articleId]) {
          articleCounts[articleId] = 0;
        }

        articleCounts[articleId] += 1;
      }
    }

    for(const id in articleCounts) {
      if(articleCounts[id] !== Object.keys(results).length) {
        delete articleCounts[id]
      }
    }

    for(const id in articleCounts) {
      // now, collect all indices of the common articles from the results object - if 'strict' then we sort them and check proximity
      for(const stem in results) {
        for(const articleId in results[stem]) {
          // only if the article is common...
          if(articleId === id) {
            var indices = results[stem][id];

            if(isStrict) {
              if(!strictCommonArticles[id]) {
                strictCommonArticles[id] = {
                  words: [ ],
                  indices: [ ]
                };
              }

              strictCommonArticles[id].words.push(stem);
              strictCommonArticles[id].indices.push(indices);
            } else {
              if(commonArticles.indexOf(articleId) < 0) {
                commonArticles.push(articleId)
              }
            }
          }
        }
      }
    }

    if(isStrict) {
      var sortedCommonArticles = { }
      // console.log(strictCommonArticles);

      for(const articleId in strictCommonArticles) {
        var allFoundWords = strictCommonArticles[articleId].words
        var allFoundIndices = strictCommonArticles[articleId].indices

        var sortedIndices = merge(allFoundWords, allFoundIndices)
        sortedCommonArticles[articleId] = sortedIndices
      }

      commonArticles = compareSortedIndices(sortedCommonArticles, searchTerms)
    }

    return { commonArticles: commonArticles, strict: isStrict }
  }

  function merge(words, indices) {
    var newArray = [ ]
    var totalCount = 0
    for(const setOfIndices of indices) {
      totalCount += setOfIndices.length
    }

    for(let i = 0; i < totalCount; i++) {
      var minimum = null
      var position = null

      for(let j = 0; j < indices.length; j++) {
        var set = indices[j]

        if(set.length === 0) {
          continue
        }

        if(minimum === null) {
          minimum = set[0]
          position = j
        } else if(set[0] !== null && set[0] < minimum) {
          minimum = set[0]
          position = j
        }
      }

      var minimumIndex = indices[position].shift()
      var minimumWord = words[position]
      newArray.push({ word: minimumWord, index: minimumIndex })
    }

    return newArray;
  }

  function compareSortedIndices(sortedCommon, inputArray) {
    var newArray = [ ]
    var wordCount = inputArray.length

    for(const articleId in sortedCommon) {
      var sorted = sortedCommon[articleId]

      for(let i = 0; i < sorted.length; i++) {
        var baseIndex = sorted[i].index
        // we check that each entry from sorted[i] to the length of the input array is a) in the right order and b) indexed in sequential order
        for(let j = 0; j < wordCount; j++) {
          if(sorted[j + i] && sorted[j + i].word === inputArray[j] && sorted[j + i].index === baseIndex + j) {
            // each word is in order, so this article is a valid result
            if(j === wordCount - 1) {
              var article = articleId
              if(newArray.indexOf(article) < 0) {
                newArray.push(article)
              }
            } else {
              continue
            }
          } else {
            continue
          }
        }
      }
    }

    return newArray
  }

  return {
    insert: function(input, articleId, index) {
      insertInput(input, articleId, index);
    },
    search: function(input) {
      return parseAndSearch(input);
    },
    lookup: function(word) {
      return index[word]
    }
  }
}

function getStem(word) {
  var prepositions = [ "the", "a", "an", "as", "on", "of", "for", "from", "in", "to", "into", "onto", "about", "around" ]
  
  if(prepositions.includes(word)) {
    return "preposition"
  }

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
    var paragraph = data[item]["text"]
    paragraph = paragraph.toLowerCase()
    var array = paragraph.split(' ')

    var parsed = array.map(word =>
      word.replace(/([^a-zA-Z])/, "")
    )
    
    var prepositionCount = 0

    for(let i = 0; i < parsed.length; i++) {
      var index = i - prepositionCount
      var word = parsed[i]
      var stem = getStem(word)

      if(stem === "preposition") {
        prepositionCount += 1
        continue
      }

      invertedIndex.insert(stem, item, index)
    }
  }
}

var index = new InvertedIndex();
parseInput(index, input);

// console.log(index.search('tree'));
// console.log(index.search('lemon, tree'));
// console.log(index.search('lemon tree'));
// console.log(index.search('apple tree'));

console.log(index.search('white'));
console.log('\n');
console.log(index.search('shark'));
console.log('\n');
console.log(index.search('white, shark'));
console.log('\n');
// console.log(index.search('great white shark'));
// console.log('\n');
console.log(index.search('the white shark'));