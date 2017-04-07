var dotty = require("dotty"),
    dottymap = require("../dotty-map.js"),
    vows = require("vows"),
    assert = require("assert");

var source = {
  a : "apple",
  b : { fruit : "banana", vegetable : "beet"},
  c : { fruit : "coconut", baking : { sweet : "cinnamon", savory : "cheddar"}}
};

vows.describe("dotty-map").addBatch({
  "A simple map": {
    "source == destination": {
      topic: function(){
        var dest = {};
        dottymap(source, dest, {"a" : "a"});
        return dest;
      },
      "is an object": function(dest) {
        assert.isObject(dest);
      },
      "a set correctly": function(dest) {
        assert.deepEqual(dest, { a : "apple"});
      },
    },
    "change a single-depth index": {
      topic: function(){
        var dest = {};
        dottymap(source, dest, {"a" : "q"});
        return dest;
      },
      "q set correctly": function(dest) {
        assert.deepEqual(dest, { q : "apple"});
      },
      "a not set in destination": function(dest) {
        assert.isUndefined(dest.a);
      },
    },
    "can copy a non-primitive": {
      topic: function(){
        var dest = {};
        dottymap(source, dest, {"b" : "noob"});
        return dest;
      },
      "dest.noob is an object": function(dest) {
        assert.isObject(dest.noob);
      },
      "dest.noob is a complete copy of source.b": function(dest) {
        assert.deepEqual(dest.noob, source.b);
      },
    },
  },
  "Changing depth": {
    "Double depth source becomes single depth in dest": {
      topic: function(){
        var dest = {};
        dottymap(source, dest, {"b.fruit" : "fruit"});
        return dest;
      },
      "dest.fruit is the string from the source": function(dest) {
        assert.equal(dest.fruit, source.b.fruit);
      },
    },
    "Single depth source becomes double depth in dest": {
      topic: function(){
        var dest = {};
        dottymap(source, dest, {"a" : "pie.filling"});
        return dest;
      },
      "dest.pie is an object": function(dest) {
        assert.isObject(dest.pie);
      },
      "dest.pie.filling is apple": function(dest) {
        assert.equal(dest.pie.filling, "apple");
      },
    },
  },
  "Missing source is skipped":{
    "Single-depth source is missing":{
      topic: function(){
        var dest = {};
        dottymap(source, dest, {"z" : "z"});
        return dest;
      },
      "dest.z is undefined": function(dest) {
        assert.isUndefined(dest.z);
      },
      "so dest is an empty object, still": function(dest) {
        assert.deepEqual(dest, {});
      },
    },
    "Leaf is missing in deep source":{
      topic: function(){
        var dest = {};
        dottymap(source, dest, {"b.meat" : "b.meat"});
        return dest;
      },
      "dest.b (whole tree) is skipped": function(dest) {
        assert.isUndefined(dest.b);
      },
    },
    "multi-depth source is missing, sometimes":{
      topic: function(){
        var dest = {};
        dottymap(source, dest, {"b.meat":"b.meat", "b.fruit":"b.fruit"});
        return dest;
      },
      "dest.b exists": function(dest) {
        assert.isObject(dest.b);
      },
      "dest.b.fruit is correct": function(dest) {
        assert.equal(dest.b.fruit, 'banana');
      },
      "dest.b.meat (missing leaf) is skipped": function(dest) {
        assert.isUndefined(dest.b.meat);
      },
    },
    "attribute missing in middle of longer source":{
      topic: function(){
        return dottymap(source, {}, {
          "c.baking.sweet" : "c.baking.sweet",
          "c.frying.sweet" : "c.frying.sweet"});
      },
      "dest.c exists": function(dest) {
        assert.isObject(dest.c);
      },
      "dest.c.baking exists": function(dest) {
        assert.isObject(dest.c.baking);
      },
      "dest.c.frying was skipped without croaking": function(dest) {
        assert.isUndefined(dest.c.frying);
      },
    }
  },
  "Mapped items missing in source are deleted from destination" : {
    "Missing, key not renamed" : {
      topic: function(){
        var dest = {"d":"donuts", "e":"empanadas"};
        dottymap(source, dest, {"d" : "d"}, true);
        return dest;
      },
      "dest.d is removed": function(dest) {
        assert.isUndefined(dest.d);
      },
      "dest.e is undisturbed": function(dest) {
        assert.equal(dest.e, 'empanadas');
      },
    },
    "Missing, key is renamed" : {
      topic: function(){
        var dest = {"d":"donuts", "e":"empanadas"};
        dottymap(source, dest, {"d" : "e"}, true);
        return dest;
      },
      "dest.e is removed": function(dest) {
        assert.isUndefined(dest.e);
      },
      "dest.d is undisturbed": function(dest) {
        assert.equal(dest.d, 'donuts');
      },
    }

  }

}).export(module);
