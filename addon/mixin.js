import Ember from 'ember';

const {
  computed,
  on,
  defineProperty,
  isArray,
  Logger,
  Mixin
} = Ember;




export default Mixin.create({

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

      const keySuffix = relationship.kind === 'hasMany' ? '.@each' : '';
      const key       = `${name}${keySuffix}.hasDirtyAttributes`;

      relatedKeysHasDirty.push(key);
    });

    defineProperty(this, 'hasDirtyAttributes', computed.apply(null, [
      'currentState.isDirty',
      ...relatedKeysHasDirty,
      function() {
        if (this.get('currentState.isDirty')) {
          return true;
        }

        const relatedModels = Ember.A(relatedKeys.map(k => this.get(k)));

        return relatedModels
          .any((related) => {
            if (isArray(related)) {
              return (
                related.isAny('hasDirtyAttributes', true)
                || (
                  related.canonicalState.length !== related.currentState.length
                  && Ember.A(related.canonicalState).any((e, i) => {
                    return e === related.currentState[i];
                  })
                )
              );
            }

            return !!related && related.get('hasDirtyAttributes');
          });
      }
    ]));
  })
});
