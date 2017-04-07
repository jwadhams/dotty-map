# dotty-map
Dotty-map copies properties from a source object to a destination object, optionally renaming them.  Dotty-map uses [dotty](https://github.com/jwadhams/dotty) to parse strings like "pie.filling.temperature" into deep property references, on either the source or the destination.

This can be especially useful to normalize an API response into your internal format.

## Examples

```js
dottymap = require('dotty-map');
var source = {
  "apples" : 1,
  "bananas" : 2
};
var destination = {};

//Re-key in Spanish
dottymap(source, destination, {
  "apples" : "manzanas",
  "bananas" : "platanos"
});

//destination = {"manzanas":1, "plantanos":2}
```

By default, dotty-map will ignore keys that are missing on the source.

```js
dottymap(
  {"apples":1, "carrots":3},
  {},
  {"apples":"manzanas", "bananas":"platanos" }
);
//returns {"manzanas":1} because the source doesn't have bananas, and the map doesn't have carrots.


dottymap(
  {"apples":1, "carrots":3},
  {"manzanas":42, "plantanos":2},
  {"apples":"manzanas", "bananas":"platanos" }
);
//returns {"manzanas":1, "plantanos":2} because the source doesn't have bananas, but the destination already did.
```

You can set the fourth argument to `true` to delete properties on the destination if they are missing on the source:

```js
dottymap(
  {"apples":1},
  {"manzanas":42, "plantanos":2},
  {"apples":"manzanas", "bananas":"platanos" },
  true
);
//returns {"manzanas":1}, the destination had its manzanas overwritten, and its plantanos deleted because the source had no bananas.
