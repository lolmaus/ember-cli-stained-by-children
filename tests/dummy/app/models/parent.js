import DS from 'ember-data';
import StainedMixin from 'ember-cli-stained-by-children/stained-by-children';

const {
  hasMany,
  Model
} = DS;

export default Model.extend(StainedMixin, {
  children: hasMany('child', {stains: true})
});
