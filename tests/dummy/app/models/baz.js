import DS from 'ember-data';
import StainedByChildrenMixin from 'stained-by-children/stained-by-children';
import CleanEmbeddedChildrenMixin from 'stained-by-children/clean-embedded-children';

export default DS.Model.extend(StainedByChildrenMixin, CleanEmbeddedChildrenMixin, {
  foo:  DS.belongsTo('foo'),
  quux: DS.belongsTo('quux', {stains: true, embeddedChild: true}),
  val:  DS.attr('boolean', {defaultValue: false})
});
