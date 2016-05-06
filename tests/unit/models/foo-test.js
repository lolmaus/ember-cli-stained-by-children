/* jshint expr:true */

import Ember from 'ember';

const {
  run
} = Ember;

import { expect } from 'chai';
import { describeModel, it } from 'ember-mocha';
import { beforeEach } from 'mocha';

let store;
let m;

describeModel(
  'parent',
  'Unit | Model | foo',
  {
    // Specify the other units that are required for this test.
    needs: ['model:child', 'model:pet'],
  },
  function() {
    beforeEach( function () {
      store = this.store();

      return run(() => {
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
              id:   '1',
              type: 'children'
            },
            {
              id:   '2',
              type: 'children'
            },
            {
              id:   '1',
              type: 'pets'
            },
            {
              id:   '2',
              type: 'pets'
            }
          ]
        });
      });
    });

    // Replace this with your real tests.
    it('parent stains itself', function() {
      const parent = store.peekRecord('parent', '1');

      m = "Parent should not be initially dirty";
      expect(parent.get('hasDirtyAttributes'), m).false;

      run(() => {
        parent.set('name', 'asdf');
      });

      m = "Parent should be dirty after updating an attribute on itself";
      expect(parent.get('hasDirtyAttributes'), m).true;
    });

    // Replace this with your real tests.
    it('dirty child stains parent', function() {
      const child  = store.peekRecord('child',  '1');
      const parent = store.peekRecord('parent', '1');

      m = "Parent should not be initially dirty";
      expect(parent.get('hasDirtyAttributes'), m).false;

      run(() => {
        child.set('name', 'foo');
      });

      m = "Parent should be dirty after updating an attribute on child";
      expect(parent.get('hasDirtyAttributes'), m).true;
    });

    // Replace this with your real tests.
    it('parent stains when children relationship is updated', function() {
      const parent = store.peekRecord('parent', '1');
      const child2 = store.peekRecord('child',  '2');

      m = "Parent should not be initially dirty";
      expect(parent.get('hasDirtyAttributes'), m).false;

      run(() => {
        parent.get('children').pushObject(child2);
      });

      m = "Parent should be dirty after adding another child";
      expect(parent.get('hasDirtyAttributes'), m).true;
    });
  }
);
