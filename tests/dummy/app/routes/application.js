import Ember from 'ember';

export default Ember.Route.extend({

  model () {
    //let parent;
    //return {
    //  parent:  parent = this.store.createRecord('parent', {
    //    name: 'Foo parent'
    //  }),
    //  children: [
    //    this.store.createRecord('child', {
    //      name: 'Foo child',
    //      parent: parent
    //    }),
    //    this.store.createRecord('child', {
    //      name: 'Bar child',
    //      parent: parent
    //    })
    //  ]
    //};

    this.store.pushPayload({
      data: {
        id:   '1',
        type: 'parents',
        attributes: {
          name: 'Foo parent'
        },
        relationships: {
          children: {
            data: [
              {id: '1', type: 'children'},
              {id: '2', type: 'children'}
            ]
          },
          dog: {
            data: {id: '1', type: 'dogs'}
          }
        }
      },
      included: [
        {
          id: '1',
          type: 'children',
          attributes: {
            name: 'Foo child'
          },
          relationships: {
            parent: {
              data: {id: '1', type: 'parents'}
            }
          }
        },
        {
          id: '2',
          type: 'children',
          attributes: {
            name: 'Bar child'
          },
          relationships: {
            parent: {
              data: {id: '2', type: 'parents'}
            }
          }
        },
        {
          id: '1',
          type: 'dogs',
          attributes: {
            name: 'Foo dog'
          }
        },
        {
          id: '2',
          type: 'dogs',
          attributes: {
            name: 'Bar dog'
          }
        }
      ]
    });

    return Ember.RSVP.hash({
      parents:  this.store.peekAll('parent'),
      dogs:     this.store.peekAll('dog')
    });
  }
});
