var dotty = require("dotty"),
    dottymap = require("../dotty-map.js"),
    vows = require("vows"),
    assert = require("assert");

var source = {
  a : "apple",
  b : { fruit : "banana", vegetable : "beet"}
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
        dottymap(source, dest, {"b.meat" : "b.meat","b.fruit":"b.fruit"});
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
  },

}).export(module);
