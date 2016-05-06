import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({

  model () {
    this
      .store
      .pushPayload({
        data: null,
        included: [
          {
            id: '1',
            type: 'parents',
            relationships: {
              children: {
                data: [
                  {id: '1', type: 'children'}
                ]
              }
            }
          },
          {
            id: '1',
            type: 'children',
            relationships: {
              parent: {
                data: {id: '1', type: 'parents'}
              }
            }
          },
          {
            id: '1',
            type: 'pets',
            attributes: {
              name: 'Foo pet'
            }
          },
          {
            id: '2',
            type: 'pets',
            attributes: {
              name: 'Bar pet'
            }
          }
        ]
      });
  }
});
