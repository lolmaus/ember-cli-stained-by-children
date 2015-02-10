# Stained-by-children

This mixin modifies the `isDirty` property of a model, making it respect the dirtiness of its children.


## Installation

You must have [Ember CLI](http://ember-cli.com) installed in your system and your project must be Ember CLI-driven.

    ember install:addon ember-cli-stained-by-children


## Usage

In your parent model:

1. Import `stained-by-children/stained-by-children` (path has changed in 0.3!).
2. Extend your model with the mixin.
3. Apply `stains: true` to the relationships whose dirtiness should affect your model's dirtiness:

```js
// app/models/foo.js

import DS from 'ember-data';
import StainedByChildrenMixin from 'stained-by-children/stained-by-children';

Foo = DS.Model.extend( StainedByChildrenMixin, {
  bars: DS.hasMany   ( 'bar',  {stains: true} )
  baz:  DS.belongsTo ( 'baz'                  )
  quux: DS.belongsTo ( 'quux', {stains: true} )
});

export default Foo;
```

In the above example, a `foo` will be marked dirty, whenever its `quux` or any of its `bars` become dirty. The `baz` will not affect `foo`'s dirtiness because the respective relationship is not flagged with `stains: true`.


## How it works

The mixin creates an `areChildrenDirty` computed property property bound to `<rels>.@each.isDirty`, where `<rels>` are all its relationships marked with `stains: true`. The property is true when any staining child is dirty.

The mixin also modifies the `isDirty` property. Originally, `isDirty` is merely an alias to `currentState.isDirty`. After you import the mixin, `isDirty` will compute to

```js
this.get('currentState.isDirty') || this.get('areChildrenDirty')
```


## Marking embedded children as clean when you save their parent

`DS.EmbeddedRecordsMixin` has a [known issue](https://github.com/emberjs/data/issues/2487): when you save a parent record, embedded children remain dirty. This is a bummer, especially when you use `StainedByChildrenMixin`.

You can resolve this issue with `CleanEmbeddedChildrenMixin`!


In your parent model:

1. Import `stained-by-children/clean-embedded-children`.
2. Extend your model with the mixin.
3. Apply `embeddedChild: true` to the relationships who should become clean when this record is saved.

The example below combines both mixins:

```js
// app/models/foo.js

import DS from 'ember-data';
import StainedByChildrenMixin from 'stained-by-children/stained-by-children';
import CleanEmbeddedChildrenMixin from 'stained-by-children/clean-embedded-children';

Foo = DS.Model.extend( StainedByChildrenMixin, CleanEmbeddedChildrenMixin, {
  bars: DS.hasMany   ( 'bar',  {stains: true, embeddedChild: true} )
  baz:  DS.belongsTo ( 'baz'                  )
  quux: DS.belongsTo ( 'quux', {stains: true, embeddedChild: true} )
});

export default Foo;
```

Cleaning children can be done recursively. Just user the mixin on child model as well as parent model, and saving a parent record will result in cleaning both its children and children's children.


## Warning!

Circular references are **not** supported!

If you define two models staining/cleaning each other, your app will be unable to start.


## License

[MIT](https://github.com/lolmaus/ember-cli-stained-by-children/blob/0.x/LICENSE.md)


## Credit

Snapped together by Andrey Mikhaylov (lolmaus) https://github.com/lolmaus

