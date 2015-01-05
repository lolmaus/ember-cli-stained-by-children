import Ember from 'ember';

export default Ember.Mixin.create({

  isDirty: Ember.computed('areChildrenDirty', 'currentState.isDirty', function() {
    return this.get('currentState.isDirty') || this.get('areChildrenDirty');
  }),


  // This gets overridden from `this._defineAreChildrenDirty()`
  areChildrenDirty: null,


  init: function() {
    this._super();

    // Setting the `areChildrenDirty` property dynamically.
    // This is required in order to bind it to all relationships.
    this._defineAreChildrenDirty();
  },


  _defineAreChildrenDirty: function() {
    var
      relationshipNames = this._relationshipNames(),
      dirtyChildrenPropertyNames = this._dirtyChildrenPropertyNames(relationshipNames),
      computedProperty;

    Ember.defineProperty(
      this, 'areChildrenDirty', (
        computedProperty = Ember.computed(
          function() {
            return this._areChildrenDirty(relationshipNames);
          }
        )
      ).property.apply(computedProperty, dirtyChildrenPropertyNames)
    );
  },


  _relationshipNames: function() {
    var relationshipNames = [];
    this.eachRelationship(function(relationshipName, relationship) {
      if (relationship.options.stains) {
        relationshipNames.push(relationshipName);
      }
    });
    return relationshipNames;
  },


  _dirtyChildrenPropertyNames: function(names) {
    if (names == null)
      names = this._relationshipNames();

    return names.map(function(name) {
      return "" + name + ".@each.isDirty";
    });
  },


  _areChildrenDirty: function(relationshipNames) {
    return relationshipNames.map(
      function(relationshipName) {
        return this._isChildDirty(relationshipName);
      }.bind(this)
    ).any(function(item) {
      return item === true;
    });
  },


  _isChildDirty: function(childName) {
    return this.get(childName).any(function(item) {
      return item.get('isDirty');
    });
  }
});
