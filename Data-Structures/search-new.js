"use strict"

const articleData = require('../Input/input.json');
/**
* Broken! Need to update InvertedIndex to parse strict search
* based on quotes
**/

function InvertedIndex() {
  var internalIndex = { };

  function getLength() {
    return Object.keys(internalIndex).length;
  }

  function insertBulkData(data) {
    for(const articleId in data) {
      var paragraph = data[articleId]["text"].toLowerCase();
      var wordsInArticle = paragraph.split(' ');

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
      internalIndex[stem] = { };
    }

    if(!internalIndex[stem][articleId]) {
      internalIndex[stem][articleId] = [ ];
    }

    internalIndex[stem][articleId].push(loc);
  }

  function newParseAndSearch(searchTermsArray) {
    const parsedSearchTermsArray = searchTermsArray.map(s => {
      return s.toLowerCase();
    });

    var lookupResultsObj = { };

    for(let i = 0; i < parsedSearchTermsArray.length; i++) {
      var word = searchTermsArr[i];
      var stem = getStem(word, true);

      if(stem === "#") {
        searchTermsArr[i] = "#";
      } else {
        lookupResultsObj[word] = { };
        var articleResults = Object.keys(internalIndex[stem]);

        for(const articleId of articleResults) {
          lookupResultsObj[word][articleId] = internalIndex[stem][articleId].slice();
        }
      }
    }
  }

  function parseAndSearch(searchTermsArray) {
    console.log(searchTermsArray);
    return;
    var searchTerms = search.toLowerCase();
    var isStrict = searchTerms.indexOf(',') < 0 && searchTerms.indexOf(' ') > 0;

    var openQuote = searchTerms.indexOf('"');
    var strictTerms = [ ];

    while(openQuote >= 0) {
      var closeQuote = searchTerms.indexOf('"', openQuote + 1);
      var strictWordOrPhrase = searchTerms.slice(openQuote + 1, closeQuote);
      strictTerms.push([strictWordOrPhrase]);
      openQuote = searchTerms.indexOf('"', closeQuote + 1);
    }

    var searchTermsArr;

    if(!isStrict && searchTerms.indexOf(',') > 0) {
      searchTermsArr = searchTerms.split(', ');
    } else {
      searchTermsArr = searchTerms.split(' ');
    }

    var lookupResultsObj = { };

    for(let i = 0; i < searchTermsArr.length; i++) {
      var word = searchTermsArr[i];
      var stem = getStem(word, true);

      if(stem === "#") {
        searchTermsArr[i] = "#";
      } else {
        lookupResultsObj[word] = { };
        var articleResults = Object.keys(internalIndex[stem]);

        for(const articleId of articleResults) {
          lookupResultsObj[word][articleId] = internalIndex[stem][articleId].slice();
        }
      }
    }

    searchTermsArr = searchTermsArr.filter(entry => {
      return entry !== "#"
    })

    var results = compareResults(searchTermsArr, lookupResultsObj, isStrict);
    var response = "Your " + (results.strict ? "strict " : "") + "search '" + search;

    if(results.commonArticles.length === 0) {
      response += "' did not yield any search results.";
    } else {
      response += "' appears in the following articles:";

      for(const common of results.commonArticles) {
        response += "\n-" + articleData[common].title;
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
                commonArticles.push(articleId);
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

    return { commonArticles: commonArticles, strict: isStrict };
  }

  function merge(wordsArr, indicesArr) {
    var sortedArr = [ ];
    var totalCount = 0;
    for(const setOfIndices of indicesArr) {
      totalCount += setOfIndices.length;
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
    //sortedCommon, inputArray
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
              var article = articleId;
              if(correctlyPositioned.indexOf(article) < 0) {
                correctlyPositioned.push(article);
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
    insert: function(input, articleId, position) {
      insertInput(input, articleId, position);
    },
    search: function(searchTermsArray) {
      return parseAndSearch(searchTermsArray);
    },
    lookup: function(word) {
      return internalIndex[word];
    },
    length: function() {
      return getLength();
    }
  }
}


var myIndex = new InvertedIndex();
myIndex.insertBulk(articleData);
// console.log(myIndex.length());

// console.log(myIndex.search('tree'));
// console.log('\n');
// console.log('----------------');
//
// console.log(myIndex.search('lemon, tree'));
// console.log('\n');
// console.log('----------------');
//
// console.log(myIndex.search('lemon tree'));
// console.log('\n');
// console.log('----------------');
//
// console.log(myIndex.search('apple tree'));
// console.log('\n');
// console.log('----------------');


console.log(myIndex.search(['white']));
console.log('\n');
console.log('----------------');
console.log(myIndex.search(['shark']));
console.log('\n');
console.log('----------------');
console.log(myIndex.search(['white', 'Shark']));
console.log('\n');
console.log('----------------');
console.log(myIndex.search(['great white shark']));
console.log('\n');
console.log('----------------');


// console.log(myIndex.search('including Norse Greek and European Christian traditions'));
// console.log('\n');
// console.log('----------------');
// console.log(myIndex.search('European Christian traditions'));
// console.log('\n');
// console.log('----------------');

// console.log(myIndex.search('"great", "white"'));
// console.log('\n');
// console.log('----------------');
// console.log(myIndex.search('"great", "white", "the greatest"'));
// console.log('\n');
// console.log('----------------');
//
// console.log(myIndex.search('great white'));
// console.log('\n');
// console.log('----------------');
