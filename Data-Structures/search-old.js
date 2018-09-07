"use strict"

const InvertedIndex = require('./InvertedIndex.js');
const articleData = require('../Input/input.json');

var myIndex = new InvertedIndex();
myIndex.insertBulk(articleData);
// console.log(myIndex.length());

console.log(myIndex.search('tree'));
console.log('\n');
console.log('----------------');

console.log(myIndex.search('lemon, tree'));
console.log('\n');
console.log('----------------');

console.log(myIndex.search('lemon tree'));
console.log('\n');
console.log('----------------');

console.log(myIndex.search('apple tree'));
console.log('\n');


console.log('\n\n*************** NEW SEARCH ***************\n\n')
console.log(myIndex.search('white'));
console.log('\n');
console.log('----------------');
console.log(myIndex.search('shark'));
console.log('\n');
console.log('----------------');
console.log(myIndex.search('white', 'Shark'));
console.log('\n');
console.log('----------------');
console.log(myIndex.search('great white shark'));
console.log('\n');
console.log('----------------');
console.log(myIndex.search('dangerous yet friendly'));
console.log('\n');
console.log('----------------');
console.log(myIndex.search('dangerous, friendly'));
console.log('\n');
// TODO: include article titles in search results


console.log('\n\n*************** NEW SEARCH ***************\n\n')
console.log(myIndex.search('including Norse Greek and European Christian traditions'));
console.log('\n');
console.log('----------------');
console.log(myIndex.search('European Christian traditions'));
console.log('\n');


// TODO: upgrade strict search to use quotes?
// console.log('\n\n*************** NEW SEARCH ***************\n\n')
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
