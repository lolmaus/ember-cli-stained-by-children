import DS from 'ember-data';
import StainedMixin from 'ember-cli-stained-by-children/stained-by-children';

const {
  attr,
  hasMany,
  Model
} = DS;

export default Model.extend(StainedMixin, {
  name:     attr('string'),
  children: hasMany('child', {stains: true, async: false})
});
