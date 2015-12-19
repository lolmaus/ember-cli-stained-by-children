import Ember from 'ember';
import DS    from 'ember-data';

const {
  computed,
  on,
  defineProperty,
  Logger
} = Ember;

const {
  ManyArray
} = DS;

export default Ember.Mixin.create({

  defineRelatedComputedProperties: on('init', function() {

    const relatedKeys         = [];
    const relatedKeysHasDirty = [];

    this.eachRelationship((name, relationship) => {

      if (!relationship.options.stains) {
        return;
      }

      if (relationship.options.async) {
        Logger.warn(
          "ember-cli-stained-by-children only supports sync relationships,"
          + `but "${this._internalModel.modelName}.${name}" is async`
        );
        return;
      }

      relatedKeys.push(name);

      const key = `${name}${relationship.kind === 'hasMany' ? '.@each' : ''}.hasDirtyAttributes`;
      relatedKeysHasDirty.push(key);
    });

    defineProperty(this, 'hasDirtyAttributes', computed.apply(null, [
      'currentState.isDirty',
      ...relatedKeysHasDirty,
      function() {
        if (this.get('currentState.isDirty')) {
          return;
        }

        const relatedModels = Ember.A(relatedKeys.map(k => this.get(k)));
        return relatedModels.any((related) => {
          if (related instanceof ManyArray) {
            return related.isAny('hasDirtyAttributes', true);
          }
          return related.get('hasDirtyAttributes');
        });
      }
    ]));
  })
});
