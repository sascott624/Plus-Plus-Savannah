"use strict"

function Node(data) {
  this.val = data;
  this.edges = { };
}

function Graph() {
  var nodes = { };
  var edgeCount = 0;

  function dijkstra(start, end) {
    var distances = { };
    var queue = Object.keys(nodes).slice();
    var visited = [ ];

    for(const nodeValue of queue) {
      distances[nodeValue] = nodeValue === start ? 0 : Infinity;
    }

    while(queue.length > 0) {
      var minDistance = Infinity;
      var currentNode;

      for(const nodeVal of queue) {
        if(distances[nodeVal] < minDistance) {
          minDistance = distances[nodeVal];
          currentNode = nodes[nodeVal];
        }
      }

      queue.splice(queue.indexOf(currentNode.val), 1);

      if(currentNode.val !== end) {
        var edgesToVisit = currentNode.edges;

        for(const edgeVal in edgesToVisit) {
          if(distances[currentNode.val] + edgesToVisit[edgeVal] < distances[edgeVal]) {
            distances[edgeVal] = distances[currentNode.val] + edgesToVisit[edgeVal];
          }
        }
      }
    }

    return distances[end];
  }

  return {
    addNode: function(value) {
      var newNode = new Node(value);
      nodes[value] = newNode;
    },
    showNode: function(value) {
      return nodes[value];
    },
    addEdge: function(a, b, distance) {
      edgeCount += 1;
      nodes[a].edges[b] = distance;
      nodes[b].edges[a] = distance;
    },
    countNodes: function() {
      var nodeKeys = Object.keys(nodes);
      return nodeKeys.length;
    },
    countEdges: function() {
      return edgeCount;
    },
    getDijkstra: function(start, end) {
      return dijkstra(start, end);
    }
  }
}

var myGraph = new Graph();
console.log(myGraph.countNodes() === 0);
myGraph.addNode('a');
console.log(myGraph.countNodes() === 1);
myGraph.addNode('b');
myGraph.addNode('c');
myGraph.addNode('d');
myGraph.addNode('e');
myGraph.addNode('f');
myGraph.addNode('g');
myGraph.addNode('h');
myGraph.addNode('i');
console.log(myGraph.countNodes() === 9);
myGraph.addEdge('a', 'f', 3);
myGraph.addEdge('a', 'b', 21);
myGraph.addEdge('a', 'c', 13);
myGraph.addEdge('b', 'c', 4);
myGraph.addEdge('b', 'g', 2);
myGraph.addEdge('c', 'd', 7);
myGraph.addEdge('c', 'h', 9);
myGraph.addEdge('d', 'g', 11);
myGraph.addEdge('d', 'e', 6);
myGraph.addEdge('f', 'g', 12);
console.log(myGraph.countEdges() === 10);
console.log(myGraph.getDijkstra('a', 'b') === 17);
console.log(myGraph.getDijkstra('a', 'g') === 15);
console.log(myGraph.getDijkstra('c', 'f') === 16);
console.log(myGraph.getDijkstra('a', 'e') === 26);
console.log(myGraph.getDijkstra('b', 'i') === Infinity);
