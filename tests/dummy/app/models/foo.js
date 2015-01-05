import DS from 'ember-data';
import StainedByChildrenMixin from 'stained-by-children/mixin';

export default DS.Model.extend(StainedByChildrenMixin, {
  bars: DS.hasMany('bar', {stains: true})
});
