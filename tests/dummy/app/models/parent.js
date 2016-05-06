import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import Stains from 'ember-cli-stained-by-children/mixin';

export default Model.extend(Stains, {
  name:     attr     ('string'),
  children: hasMany  ('child', {stains: true, async: false}),
  pet:      belongsTo('pet',   {stains: true, async: false})
});
