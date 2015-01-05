# Stained-by-children

This mixin modifies the `isDirty` property of a model, making it respect the dirtiness of its children.


## Installation

You must have [Ember CLI](http://ember-cli.com) installed in your system and your project must be Ember CLI-driven.

    ember install:addon ember-cli-stained-by-children


## Usage

In your model:

1. Import `stained-by-children/mixin`.
2. Extend your model with the mixin.
3. Apply `stains: true` to the relationships whose dirtiness should affect your model's dirtiness:

```js
// app/models/foo.js

import DS from 'ember-data';
import StainedByChildrenMixin from 'stained-by-children/mixin';

Foo = DS.Model.extend( StainedByChildrenMixin, {
  bars: DS.hasMany   ( 'bar',  {stains: true} )
  baz:  DS.belongsTo ( 'baz'                  )
  quux: DS.belongsTo ( 'quux', {stains: true} )
});
```

In the above example, a `foo` will be marked dirty, whenever its `quux` or any of its `bars` become dirty. The `baz` will not affect `foo`'s dirtiness because the respective relationship is not flagged with `stains: true`.


## How it works

The mixin creates an `areChildrenDirty` computed property property bound to `<rels>.@each.isDirty`, where `<rels>` are all its relationships marked with `stains: true`. The property is true when any staining child is dirty.

The mixin also modifies the `isDirty` property. Originally, `isDirty` is merely an alias to `currentState.isDirty`. After you import the mixin, `isDirty` will compute to

```js
this.get('currentState.isDirty') || this.get('areChildrenDirty')
```

## License

MIT


## Credit

Snapped together by Andrey Mikhaylov (lolmaus) https://github.com/lolmaus

