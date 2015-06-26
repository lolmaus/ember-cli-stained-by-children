import Ember from 'ember';

export default Ember.Mixin.create({

  _processRelationships: function(callback) {
    this.eachRelationship(function(relationshipName, relationship) {
      if (relationship.options.embeddedChild) {
        callback(relationshipName, relationship);
      }
    });
  },


  _processRelationshipsOneOrMany: function(callback) {
    this._processRelationships(
      function(relationshipName, relationship) {
        var itemOrItems = this.get(relationshipName);
        switch (relationship.kind) {
          case 'belongsTo':
            callback(itemOrItems);
            break;
          case 'hasMany':
            itemOrItems.forEach(function(child) {
              callback(child);
            });
        }
      }.bind(this)
    );
  },

  _clearChildAttributes: function(child) {
    if(child.get('_internalModel')) {
      // Ember Data 1.0.0-beta.19.2 uses _internalModel
      child.set('_internalModel._attributes', {});
    } else {
      child.set('_attributes', {});
    }
  },

  save: function() {
    return this
      ._super()
      .then(
        function() {
          this._processChildren(function(child) {
            this._clearChildAttributes(child);
          }.bind(this));
        }.bind(this)
    );
  },


  rollback: function() {
    this._processChildren(function(child) {
      child.rollback();
    });
    return this._super();
  },


  _processChildren: function(callback) {
    this._processRelationshipsOneOrMany(function(child) {
      if ((child == null) || !child.get('isDirty')) {
        return;
      }

      child.send('willCommit');
      callback(child);
      child.send('didCommit');

      if (typeof child._cleanChildren === "function") {
        child._cleanChildren();
      }
    });
  },


  _cleanChildren: function() {
    this._processChildren(function(child) {
      this._clearChildAttributes(child);
    }.bind(this));
  }

});
