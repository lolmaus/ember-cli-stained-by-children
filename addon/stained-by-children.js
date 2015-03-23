import Ember from 'ember';

export default Ember.Mixin.create({


  isFilthy: Ember.computed('areChildrenDirty', 'currentState.isDirty', function() {
    return this.get('currentState.isDirty') || this.get('areChildrenDirty');
  }),


  // This gets overridden from `this._defineAreChildrenDirty()`
  areChildrenDirty: null,


  init: function() {
    this._super();

    // Setting the `areChildrenDirty` property dynamically.
    // This is required in order to bind it to all relationships.
    this._defineAreChildrenDirty();
    this._deprecatedDefineIsDirty();
  },

  _deprecatedDefineIsDirty: function() {
    Ember.defineProperty(this, 'isDirty', Ember.computed('areChildrenDirty', 'currentState.isDirty', function() {
      return this.get('currentState.isDirty') || this.get('areChildrenDirty');
    }));

    Ember.deprecate('ember-cli-stained-by-children: redifining the \'isDirty\' property is no longer allowed in Ember and will be removed in a future version of ember-cli-stained-by-children. Please use \'isFilthy\' instead.', false);
  },

  _defineAreChildrenDirty: function() {
    var
      relationships = this._stainingRelationships(),
      dirtyChildrenPropertyNames = this._dirtyChildrenPropertyNames(relationships),
      computedProperty;

    Ember.defineProperty(
      this, 'areChildrenDirty', (
        computedProperty = Ember.computed(
          function() {
            return this._areChildrenDirty(relationships);
          }
        )
      ).property.apply(computedProperty, dirtyChildrenPropertyNames)
    );
  },

  _stainingRelationships: function() {
    var relationships = [];

    this.eachRelationship(function(relationshipName, relationship) {
      if (relationship.options.stains !== true) {
        return;
      }

      var newRelationship = {
        name:         relationshipName,
        kind:         relationship.kind,
        propertyName: this._propertyNameForRelationship(relationshipName, relationship)
      };
      relationships.push(newRelationship);
    }.bind(this));

    return relationships;
  },


  _propertyNameForRelationship: function(relationshipName, relationship) {
    var propertyName = relationshipName;
    if (relationship.kind === 'hasMany') {
      propertyName += ".@each.{isDirty,isFilthy}";
    } else {
      propertyName += ".{isDirty,isFilthy}";
    }
    return propertyName;
  },


  //_relationshipNames: function() {
  //  var relationshipNames = [];
  //  this.eachRelationship(function(relationshipName, relationship) {
  //    if (relationship.options.stains) {
  //      relationshipNames.push(relationshipName);
  //    }
  //  });
  //  return relationshipNames;
  //},
  //
  //
  _dirtyChildrenPropertyNames: function(relationships) {
    if (!relationships) {
      relationships = this._stainingRelationships();
    }

    return relationships.map( function(relationship) {
      return relationship.propertyName;
    });
  },


  _areChildrenDirty: function(relationships) {
    return relationships.map(
      function(relationship) {
        return this._isChildDirty(relationship);
      }.bind(this)
    ).any(function(item) {
      return item === true;
    });
  },


  _isChildDirty: function(relationship) {
    var child = this.get(relationship.name);

    if (!child) { return false; }

    if (relationship.kind === 'hasMany') {
      return child.any(function (item) {
        return item.get('isFilthy') || item.get('isDirty');
      });

    } else {
      return child.get('isFilthy') || child.get('isDirty');
    }
  }
});
