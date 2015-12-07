import Ember from 'ember';
import DS    from 'ember-data';

const {
  computed
} = Ember;

const hasProperty = function (model, property) {
  if (model instanceof DS.ManyArray) {
    const singleInstance = model.objectAt(0);
    return singleInstance && Ember.isPresent(singleInstance[property]);
  } else {
    return Ember.isPresent(model[property]);
  }
};

export default Ember.Mixin.create({
  isStained: computed(function() {
    if (this.get('hasDirtyAttributes')) {
      return true;
    }

    let dirty = false;

    this.eachRelationship((name, relationship) => {
      const related = this.get(name);

      if (dirty || !related || !relationship.options.stains) {
        return;
      }

      const dirtyKey =
        hasProperty(related, 'isStained')
        ? 'isStained'
        : 'hasDirtyAttributes';

      dirty =
        relationship.kind === 'hasMany'
        ? related.isAny(dirtyKey, true)
        : related.get(dirtyKey);
    });

    return dirty;
  }).volatile()
});
