;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['dotty'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('dotty'));
  } else {
    root.dottymap = factory(root.dotty);
  }

}(this, function (dotty) {

  return function(source, destination, map, delete_if_source_missing){
    for(var source_key in map){
      var dest_key = map[source_key],
        value = dotty.get(source, source_key);

      if(value !== undefined){
        dotty.put(destination, dest_key, value);
        
      }else if(delete_if_source_missing){
        dotty.remove(destination, dest_key);
      }

    }
    return destination;
  };
}));
