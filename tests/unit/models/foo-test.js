import Ember from 'ember';

import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('foo', 'Foo', {
  // Specify the other units that are required for this test.
  needs: ['model:bar', 'model:baz', 'model:quux']
});

var setupTestData = function(store) {

  // foo
  store.push('foo', {id: '1', bars: ['1', '2'], baz: '1'});

  // bar
  store.pushMany('bar', [
    {id: '1', foo: '1'},
    {id: '2', foo: '1'},
    {id: '3', foo: '1'}
  ]);

  // baz
  store.push('baz', {id: '1', foo: '1', quux: '1'});

  // quux
  store.push('quux', {id: '1', baz: '1', str: 'quux'});

  return store;
};

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});

test('StainedByChildrenMixin: Changing a grandchild quux should stain parent foo', function() {

  Ember.run(function() {
    var store = setupTestData(this.store());

    var foo  = store.all('foo').findBy('id', '1');
    var bar1 = store.all('bar').findBy('id', '1');
    var baz  = store.all('baz').findBy('id', '1');
    var quux = store.all('quux').findBy('id', '1');

    ok(!foo.get('isDirty'));

    quux.set('val', true);

    ok(baz.get('isDirty'));
    ok(foo.get('isDirty'));
    ok(!bar1.get('isDirty'));

  }.bind(this));
});


test('CleanEmbeddedChildrenMixin: Triggering _commitChildren on parent should clean children', function() {

  Ember.run(function() {
    var store = setupTestData(this.store());

    var foo  = store.all('foo').findBy('id', '1');
    var bar1 = store.all('bar').findBy('id', '1');
    var baz  = store.all('baz').findBy('id', '1');
    var quux = store.all('quux').findBy('id', '1');

    bar1.set('val', true);
    baz.set('val', true);
    quux.set('val', true);

    foo._cleanChildren();

    ok(!bar1.get('isDirty'));
    ok(!baz.get('isDirty'));
    ok(!quux.get('isDirty'));

  }.bind(this));
});


test('CleanEmbeddedChildrenMixin: Should not crash on empty relationships', function() {

  Ember.run(function() {
    var store = this.store();

    store.push('foo', {id: '2'});
    var foo  = store.all('foo').findBy('id', '2');

    foo._cleanChildren();

    ok(true, 'Should not error out');

  }.bind(this));
});

test("call save() on root record should process childs 'isDirty' state", function() {

  stop();
  Ember.run(function() {

    var store = setupTestData(this.store());

    var foo = store.all('foo').findBy('id', '1');
    var bar1 = store.all('bar').findBy('id', '1');
    var bar2 = store.all('bar').findBy('id', '2');

    ok(!foo.get('isDirty'));
    ok(!bar1.get('isDirty'));
    ok(!bar2.get('isDirty'));

    bar2.set('val', true);

    ok(foo.get('isDirty'));
    ok(!bar1.get('isDirty'));
    ok(bar2.get('isDirty'));

    foo.save().then(function() {

      start();
      ok(!foo.get('isDirty'));
      ok(!bar1.get('isDirty'));
      ok(!bar2.get('isDirty'));

    });

  }.bind(this));

});

test('call rollback() on root record should rollback all dirty childs', function() {

  Ember.run(function() {

    var store = setupTestData(this.store());

    var foo = store.all('foo').findBy('id', '1');
    var bar = store.all('bar').findBy('id', '1');
    var baz = store.all('baz').findBy('id', '1');
    var quux = store.all('quux').findBy('id', '1');

    ok(!foo.get('isDirty'));
    ok(!bar.get('isDirty'));
    ok(!baz.get('isDirty'));
    ok(!quux.get('isDirty'));

    strictEqual(quux.get('str'), 'quux');
    quux.set('str', 'foo');
    strictEqual(quux.get('str'), 'foo');

    ok(foo.get('isDirty'));
    ok(!bar.get('isDirty'));
    ok(baz.get('isDirty'));
    ok(quux.get('isDirty'));

    foo.rollback();

    ok(!foo.get('isDirty'));
    ok(!bar.get('isDirty'));
    ok(!baz.get('isDirty'));
    ok(!quux.get('isDirty'));

    strictEqual(quux.get('str'), 'quux');

  }.bind(this));

});
