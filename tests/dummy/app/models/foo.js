import DS from 'ember-data';
import StainedByChildrenMixin from 'stained-by-children/stained-by-children';
import CleanEmbeddedChildrenMixin from 'stained-by-children/clean-embedded-children';

export default DS.Model.extend(StainedByChildrenMixin, CleanEmbeddedChildrenMixin, {
  bars: DS.hasMany('bar', {stains: true, embeddedChild: true}),
  baz:  DS.belongsTo('baz', {stains: true, embeddedChild: true}),
  val:  DS.attr('boolean', {defaultValue: false})
});
