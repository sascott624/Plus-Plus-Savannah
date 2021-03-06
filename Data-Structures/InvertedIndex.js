"use strict"

module.exports = function() {
  var internalIndex = { };
  var internalArticleIndex = { };

  function getLength() {
    return Object.keys(internalIndex).length;
  }

  function insertBulkData(data) {
    for(const articleId in data) {
      var paragraph = data[articleId]["text"].toLowerCase();
      var wordsInArticle = paragraph.split(' ');

      internalArticleIndex[articleId] = {
        title: data[articleId]["title"],
        wordCount: wordsInArticle.length
      };

      var formattedWords = wordsInArticle.map(word =>
        word.replace(/[^a-zA-Z]/, "")
      )

      var prepositionCount = 0;

      for(let i = 0; i < formattedWords.length; i++) {
        var positionInArticle = i - prepositionCount;
        var word = formattedWords[i];
        var stem = getStem(word);

        if(stem === "#") {
          prepositionCount += 1;
          continue;
        }

        insertInput(stem, articleId, positionInArticle);
      }
    }
  }

  function getStem(word, check) {
    word = word.replace(/[^a-zA-Z]/g, "");
    var prepositions = [ "the", "a", "an", "and", "as", "on", "of", "for", "from", "in", "to", "into", "onto", "about", "around" ];

    if(prepositions.includes(word)) {
      return "#"
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

      var wordEnd = word.slice(end.length * -1);
      if(wordEnd === end) {
        if(end === "s" && word.slice(end.length * -2) === "ss") {
          return word;
        }

        newWord = word.slice(0, end.length * -1)

        if(colon && replacement) {
          newWord += replacement;
        }
        break;
      }
    }

    if(!newWord) {
      newWord = word
    }

    return newWord;
  }

  function insertInput(stem, articleId, loc) {
    if(!internalIndex[stem]) {
      internalIndex[stem] = { }
    }

    if(!internalIndex[stem][articleId]) {
      internalIndex[stem][articleId] = [ ]
    }

    internalIndex[stem][articleId].push(loc)
  }

  function parseAndSearch(inputString) {
    var lowerCaseSrch = inputString.toLowerCase();
    var strict = lowerCaseSrch.indexOf(',') < 0 && lowerCaseSrch.indexOf(' ') > 0;
    var inputArray;

    if(!strict && lowerCaseSrch.indexOf(',') > 0) {
      inputArray = lowerCaseSrch.split(', ');
    } else {
      inputArray = lowerCaseSrch.split(' ');
    }

    var indexResults = { }

    for(let i = -0; i < inputArray.length; i++) {
      var word = inputArray[i];
      var stem = getStem(word);

      if(stem === "#") {
        inputArray[i] = "#";
      } else {
        if(internalIndex[stem]) {
          const articleIds = Object.keys(internalIndex[stem]);

          for(const id of articleIds) {
            indexResults[word] = indexResults[word] || { };
            indexResults[word][id] = internalIndex[stem][id].slice();
          }
        }
      }
    }

    inputArray = inputArray.filter(entry => {
      return entry !== "#";
    })

    var results = compareResults(inputArray, indexResults, strict);
    var response = "Your " + (results.strict ? "strict " : "") + "search '" + inputString;

    if(results.commonArticles.length === 0) {
      response += "' did not yield any search results."
    } else {
      response += "' appears in the following articles:"

      for(const common of results.commonArticles) {
        response += "\n-" + internalArticleIndex[common].title;
      }
    }

    return response;
  }

  function compareResults(searchTermsArr, lookupResultsObj, isStrict) {
    var articleTallies = { };
    var commonArticles = [ ];
    var strictCommonArticles = { };

    for(const stem in lookupResultsObj) {
      for(const articleId in lookupResultsObj[stem]) {
        if(!articleTallies[articleId]) {
          articleTallies[articleId] = 0;
        }

        articleTallies[articleId] += 1;
      }
    }

    for(const articleId in articleTallies) {
      if(articleTallies[articleId] !== Object.keys(lookupResultsObj).length) {
        delete articleTallies[articleId];
      }
    }

    for(const commonArticleId in articleTallies) {
      // now, collect all indices of the common articles from the results object - if 'strict' then we sort them and check proximity
      for(const stem in lookupResultsObj) {
        for(const articleId in lookupResultsObj[stem]) {
          // only if the article is common...
          if(articleId === commonArticleId) {
            var indices = lookupResultsObj[stem][commonArticleId];

            if(isStrict) {
              if(!strictCommonArticles[commonArticleId]) {
                strictCommonArticles[commonArticleId] = {
                  wordsArr: [ ],
                  indicesArr: [ ]
                };
              }

              strictCommonArticles[commonArticleId].wordsArr.push(stem);
              strictCommonArticles[commonArticleId].indicesArr.push(indices);
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
      var sortedCommonArticles = { };

      for(const articleId in strictCommonArticles) {
        var allFoundWords = strictCommonArticles[articleId].wordsArr;
        var allFoundIndices = strictCommonArticles[articleId].indicesArr;

        var sortedIndices = merge(allFoundWords, allFoundIndices);
        sortedCommonArticles[articleId] = sortedIndices;
      }

      commonArticles = compareSortedIndices(sortedCommonArticles, searchTermsArr);
    }

    return { commonArticles, strict: isStrict }
  }

  function merge(wordsArr, indicesArr) {
    var sortedArr = [ ];
    var totalCount = 0;

    for(const setOfIndices of indicesArr) {
      totalCount += setOfIndices.length
    }

    for(let i = 0; i < totalCount; i++) {
      var minimum = null;
      var position = null;

      for(let j = 0; j < indicesArr.length; j++) {
        var set = indicesArr[j];

        if(set.length === 0) {
          continue;
        }

        if(minimum === null) {
          minimum = set[0];
          position = j;
        } else if(set[0] !== null && set[0] < minimum) {
          minimum = set[0];
          position = j;
        }
      }

      var minimumIndex = indicesArr[position].shift();
      var minimumWord = wordsArr[position];
      sortedArr.push({ word: minimumWord, index: minimumIndex });
    }

    return sortedArr;
  }

  function compareSortedIndices(sortedCommonArticles, searchTermsArr) {
    var correctlyPositioned = [ ];
    var wordCount = searchTermsArr.length;

    for(const articleId in sortedCommonArticles) {
      var sortedByLoc = sortedCommonArticles[articleId];

      for(let i = 0; i < sortedByLoc.length; i++) {
        var baseIndex = sortedByLoc[i].index;
        // we check that each entry from sorted[i] to the length of the input array is a) in the right order and b) indexed in sequential order
        for(let j = 0; j < wordCount; j++) {
          if(sortedByLoc[j + i] && sortedByLoc[j + i].word === searchTermsArr[j] && sortedByLoc[j + i].index === baseIndex + j) {
            // each word is in order, so this article is a valid result
            if(j === wordCount - 1) {
              var article = articleId
              if(correctlyPositioned.indexOf(article) < 0) {
                correctlyPositioned.push(article)
              }
            } else {
              continue;
            }
          } else {
            continue;
          }
        }
      }
    }

    return correctlyPositioned;
  }

  return {
    insertBulk: function(articleData) {
      insertBulkData(articleData);
    },
    insert: function(stem, articleId, loc) {
      insertInput(stem, articleId, loc);
    },
    search: function(input) {
      return parseAndSearch(input);
    },
    lookup: function(word) {
      return internalIndex[word];
    },
    length: function() {
      return getLength();
    },
    getWordCount: function(articleId) {
      return internalArticleIndex[articleId].wordCount;
    }
  }
}
