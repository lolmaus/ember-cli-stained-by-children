import Ember from 'ember';

export default Ember.Mixin.create({

  init: function() {
    this._super();
    this.defineAreChildrenDirty();
  },


  relationshipNames: function() {
    var relationshipNames = [];
    this.eachRelationship(function(relationshipName, relationship) {
      if (relationship.kind === 'hasMany') {
        relationshipNames.push(relationshipName);
      }
    });
    return relationshipNames;
  },


  dirtyChildrenPropertyNames: function(names) {
    if (names == null)
      names = this.relationshipNames();

    return names.map(function(name) {
      return "" + name + ".@each.isDirty";
    });
  },


  defineAreChildrenDirty: function() {
    var
      hasManyRelationshipNames = this.hasManyRelationshipNames(),
      dirtyChildrenPropertyNames = this.dirtyChildrenPropertyNames(hasManyRelationshipNames),
      thisOfProperty;

    Ember.defineProperty(this, 'areChildrenDirty', (
      thisOfProperty = Ember.computed(
        function() {
          return this._areChildrenDirty(hasManyRelationshipNames);
        }
      )
    ).property.apply(thisOfProperty, dirtyChildrenPropertyNames));
  },


  _areChildrenDirty: function(hasManyRelationshipNames) {
    return hasManyRelationshipNames.map(
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
  },


  isDirty: Ember.computed('areChildrenDirty', 'currentState.isDirty', function() {
    return this.get('currentState.isDirty') || this.get('areChildrenDirty');
  })
});
