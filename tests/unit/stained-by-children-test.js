import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

const { run } = Ember;

moduleForModel('parent', 'Unit | Mixin | stained-by-children', {
  // Specify the other units that are required for this test.
  needs: [
    'model:child',
    'model:dog'
  ]
});

test('dirty child stains parent', function(assert) {
  const store = this.store();

  run(() => {
    store.pushPayload({
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
  });

  const child  = store.peekRecord('child', '1');
  const parent = store.peekRecord('parent', '1');

  assert.notOk(parent.get('hasDirtyAttributes'));

  run(() => {
    child.set('name', 'foo');
  });

  assert.ok(parent.get('hasDirtyAttributes'));
});
