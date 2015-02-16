import DS from 'ember-data';

export default DS.Model.extend({
  baz: DS.belongsTo('baz'),
  val: DS.attr('boolean', {defaultValue: false}),
  str: DS.attr('string', { defaultValue: '' })
});
