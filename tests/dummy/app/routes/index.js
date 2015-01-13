import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    this.store.push('foo', { id: 1});
    this.store.push('bar', { id: 1, foo: 1});
    this.store.push('bar', { id: 2, foo: 1});
    this.store.push('baz', { id: 1, foo: 1});

    return this.store.find('foo', 1);
  }
});
