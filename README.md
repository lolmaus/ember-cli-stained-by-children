[![NPM package](https://img.shields.io/npm/v/ember-cli-stained-by-children.svg)](https://www.npmjs.com/package/ember-cli-stained-by-children)
[![Build Status](https://img.shields.io/travis/lolmaus/ember-cli-stained-by-children.svg)](https://travis-ci.org/lolmaus/ember-cli-stained-by-children)

This addon grew into a collection of mixins. The addon is named after the first of those mixins. Thus, the name doesn't reflect the capabilities of the addon very well, but i decided not to change it. -- [@lolmaus](https://github.com/lolmaus)



# Installation

You must have [Ember CLI](http://ember-cli.com) installed in your system and your project must be Ember CLI-driven.


In your project folder:

    ember install:addon ember-cli-stained-by-children
    
    
# The mixins
    
    

## `stained-by-children`

This mixin modifies the `isDirty` property of a model, making it respect the dirtiness of its children.


### Usage

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


### How it works

The mixin creates an `areChildrenDirty` computed property property bound to `<rels>.@each.isDirty`, where `<rels>` are all its relationships marked with `stains: true`. The property is true when any staining child is dirty.

The mixin also modifies the `isDirty` property. Originally, `isDirty` is merely an alias to `currentState.isDirty`. After you import the mixin, `isDirty` will compute to

```js
this.get('currentState.isDirty') || this.get('areChildrenDirty')
```




### :warning: Warning!

* **Circular references are *not* supported!**

  If you define two models staining/cleaning each other, your app will be unable to start.

* This mixin only reflects the dirtiness of children. It does not make the parent record dirty when the relationship content changes. That is, **when a non-dirty child is replaced with another non-dirty child, the result is non-dirty**. :(

  I struggle to figure out how to address this use case. The tricky part simply creating a parent record with children already triggers observers for `child` and `children.[]`. If you can think of a way to overcome this, chime into [the discussion](https://github.com/lolmaus/ember-cli-stained-by-children/issues/2).


## `clean-embedded-children`

`DS.EmbeddedRecordsMixin` has a [known issue](https://github.com/emberjs/data/issues/2487): when you save a parent record, embedded children remain dirty. This is a bummer, especially when you use `stained-by-children`.

You can resolve this issue with `clean-embedded-children`!


### Usage


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
  baz:  DS.belongsTo ( 'baz'                                       )
  quux: DS.belongsTo ( 'quux', {stains: true, embeddedChild: true} )
});

export default Foo;
```

Cleaning children can be done recursively. Just user the mixin on child model as well as parent model, and saving a parent record will result in cleaning both its children and children's children.


# License

[MIT](https://github.com/lolmaus/ember-cli-stained-by-children/blob/0.x/LICENSE.md)


# Credit

Snapped together by Andrey Mikhaylov (lolmaus) https://github.com/lolmaus

