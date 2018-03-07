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
    var inputArray = inputString.split(' ');
    var results = [ ];

    for(const word of inputArray) {
      var stem = getStem(word);
      results.push(index[stem]);
    }

    if(inputArray.length === 1) {
      var response = "Your search '" + inputString + "' appears in the following articles:"
      var result = results[0];
      for(const article in result) {
        response += "\n-" + input[article].title
      }
      return response;
    } else {
      return compareResults(inputArray, results);
    }
  }

  function compareResults(inputArray, articles) {
    var articleCounts = { }
    var commonArticles = { }

    for(let i = 0; i < articles.length; i++) {
      for(const article in articles[i]) {
        if(!articleCounts[article]) {
          articleCounts[article] = 0
        }

        articleCounts[article] += 1;
      }
    }

    for(const id in articleCounts) {
      if(articleCounts[id] === articles.length) {
        commonArticles[id] = [ ]

        for(let i = 0; i < articles.length; i++) {
          var found = articles[i];
          for(const article in found) {
            if(article === id) {
              commonArticles[id].push(found[article])
            }
          }
        }
      }
    }

    for(const common in commonArticles) {
      var indices = commonArticles[common];
      // for(let i = 0; i < indices.length; i++) {
      //   for(let j = 0; j < indices[i].length; j++) {
      //     var index = indices[i][j];
      //
      //   }
      // }
    }

    var response = "Your search '" + inputArray.join(' ') + "' appears in the following articles:"

    for(const common in commonArticles) {
      response += "\n-" + input[common].title
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
  // console.log(newWord);
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
console.log(index.search('lemon tree'));
console.log(index.search('apple tree'));
console.log(index.search('white shark'));
console.log(index.search('sharks'));
