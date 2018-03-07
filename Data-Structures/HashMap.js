"use strict"

function Node(key, value) {
  this.key = key;
  this.val = value;
  this.next = null;
}

function HashMap() {
  var map = [ ];

  function hashingFunction(input) {
    var total = 0;
    for(let i = 0; i < input.length; i++) {
      var code = input.charCodeAt(i);
      var binary = code.toString(2);
      total += binary;
    }

    total = total / 128;

    // arbitrarily limiting our hashmap to a max of 25 indices
    return total % 25;
  }

  function insert(index, key, value) {
    var slot = map[index];
    var entry = new Node(key, value);

    if(!slot) {
      map[index] = entry;
    } else {
      var current = slot;

      while(current) {
        if(current.next) {
          current = current.next;
        } else {
          current.next = entry;
          current = null;
        }
      }
    }
  }

  return {
    store: function(key, value) {
      var hash = hashingFunction(key);
      insert(hash, key, value);
    },
    lookup: function(key) {
      var hash = hashingFunction(key);
      var current = map[hash];
      if(current.key === key) {
        return current.val;
      } else {
        while(current) {
          if(current.key === key) {
            return current.val;
          }

          current = current.next
        }
      }
    },
    showMap: function() {
      console.log(map);
    }
  }
}

var hashmap = new HashMap();
hashmap.store("destinys", "child");
hashmap.showMap();
hashmap.store("window", "wall");
hashmap.showMap();
hashmap.store("therock", "is cooking");
hashmap.showMap();
hashmap.store("mary", "berry");
hashmap.showMap();
console.log(hashmap.lookup("therock"));
// just to show we're handling collisions
hashmap.store("mary", "had a little lamb");
hashmap.showMap();
console.log(hashmap.lookup("mary"));
