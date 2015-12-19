import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    changeDog(parent, event) {
      const dog = this.get('model.dogs').findBy('id', event.target.value);
      parent.set('dog', dog);
    }
  }
});
