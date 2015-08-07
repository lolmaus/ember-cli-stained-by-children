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

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});

test('StainedByChildrenMixin: Changing a grandchild quux should stain parent foo', function(assert) {

  Ember.run(function() {
    var store = setupTestData(this.store());

    var foo  = store.all('foo').findBy('id', '1');
    var bar  = store.all('bar').findBy('id', '1');
    var baz  = store.all('baz').findBy('id', '1');
    var quux = store.all('quux').findBy('id', '1');

    assert.ok(!foo.get('isDirty'));

    quux.set('val', true);

    assert.ok(baz.get('isDirty'), 'baz should become dirty');
    assert.ok(foo.get('isDirty'), 'foo should become dirty');
    assert.ok(!bar.get('isDirty', 'bar should not become dirty'));

  }.bind(this));
});


test('CleanEmbeddedChildrenMixin: Triggering _commitChildren on parent should clean children', function(assert) {

  Ember.run(function() {
    var store = setupTestData(this.store());

    var foo  = store.all('foo').findBy('id', '1');
    var bar  = store.all('bar').findBy('id', '1');
    var baz  = store.all('baz').findBy('id', '1');
    var quux = store.all('quux').findBy('id', '1');

    bar.set('val', true);
    baz.set('val', true);
    quux.set('val', true);

    foo._cleanChildren();

    assert.ok(!bar.get('isDirty'),  'bar should not become dirty');
    assert.ok(!baz.get('isDirty'),  'baz should not become dirty');
    assert.ok(!quux.get('isDirty'), 'quux should not become dirty');

  }.bind(this));
});


test('CleanEmbeddedChildrenMixin: Should not crash on empty relationships', function(assert) {

  Ember.run(function() {
    var store = this.store();

    store.push('foo', {id: '2'});
    var foo  = store.all('foo').findBy('id', '2');

    foo._cleanChildren();

    assert.ok(true, 'Should not error out');

  }.bind(this));
});

test("CleanEmbeddedChildrenMixin: call save() on root record should process childs 'isDirty' state", function(assert) {

  var done = assert.async();
  Ember.run(function() {

    var store = setupTestData(this.store());

    var foo = store.all('foo').findBy('id', '1');
    var bar1 = store.all('bar').findBy('id', '1');
    var bar2 = store.all('bar').findBy('id', '2');

    assert.ok(!foo.get('isDirty'), 'foo isn\'t dirty');
    assert.ok(!bar1.get('isDirty'), 'bar1 isn\'t dirty');
    assert.ok(!bar2.get('isDirty'), 'bar2 isn\'t dirty');

    assert.ok(!bar2.get('val'), 'bar2 default value of `val` is `false`');
    bar2.set('val', true);
    assert.ok(bar2.get('val'), 'set bar2 value of `val` to `true`');

    assert.ok(foo.get('isDirty'), 'foo is dirty');
    assert.ok(!bar1.get('isDirty'), 'bar1 isn\'t dirty');
    assert.ok(bar2.get('isDirty'), 'bar2 is dirty');

    foo.save().then(function() {
      assert.ok(!foo.get('isDirty'), 'foo isn\'t dirty after foo.save()');
      assert.ok(!bar1.get('isDirty'), 'bar1 isn\'t dirty after foo.save()');
      assert.ok(!bar2.get('isDirty'), 'bar2 isn\'t dirty after foo.save()');

      assert.ok(bar2.get('val'), 'bar2 value of `val` is persisted to `true` after foo.save()');

      done();
    });

  }.bind(this));

});

test('CleanEmbeddedChildrenMixin: call rollback() on root record should rollback all dirty childs', function(assert) {

  Ember.run(function() {

    var store = setupTestData(this.store());

    var foo = store.all('foo').findBy('id', '1');
    var bar = store.all('bar').findBy('id', '1');
    var baz = store.all('baz').findBy('id', '1');
    var quux = store.all('quux').findBy('id', '1');

    assert.ok(!foo.get('isDirty'), 'foo isn\'t dirty');
    assert.ok(!bar.get('isDirty'), 'bar isn\'t dirty');
    assert.ok(!baz.get('isDirty'), 'baz isn\'t dirty');
    assert.ok(!quux.get('isDirty'), 'quux isn\'t dirty');

    assert.ok(!quux.get('val'), 'quux default value of `val` is `false`');
    quux.set('val', true);
    assert.ok(quux.get('val'), 'set quux value of `val` to `true`');

    assert.ok(foo.get('isDirty'), 'foo is dirty');
    assert.ok(!bar.get('isDirty'), 'bar isn\'t dirty');
    assert.ok(baz.get('isDirty'), 'baz is dirty');
    assert.ok(quux.get('isDirty'), 'quux is dirty');

    foo.rollback();

    assert.ok(!foo.get('isDirty'), 'foo isn\'t dirty after foo.rollback()');
    assert.ok(!bar.get('isDirty'), 'bar isn\'t dirty after foo.rollback()');
    assert.ok(!baz.get('isDirty'), 'baz isn\'t dirty after foo.rollback()');
    assert.ok(!quux.get('isDirty'), 'quux isn\'t dirty after foo.rollback()');

    assert.ok(!quux.get('val'), 'quux value of `val` is rollbacked to `false`');

  }.bind(this));

});

test('CleanEmbeddedChildrenMixin: call reload() on root record should rollback all dirty childs', function(assert) {

  var done = assert.async();
  Ember.run(function() {

    var store = setupTestData(this.store());

    var foo = store.all('foo').findBy('id', '1');
    var bar = store.all('bar').findBy('id', '1');
    var baz = store.all('baz').findBy('id', '1');
    var quux = store.all('quux').findBy('id', '1');

    assert.ok(!foo.get('isDirty'), 'foo isn\'t dirty');
    assert.ok(!bar.get('isDirty'), 'bar isn\'t dirty');
    assert.ok(!baz.get('isDirty'), 'baz isn\'t dirty');
    assert.ok(!quux.get('isDirty'), 'quux isn\'t dirty');

    assert.ok(!quux.get('val'), 'quux default value of `val` is `false`');
    quux.set('val', true);
    assert.ok(quux.get('val'), 'set quux value of `val` to `true`');

    assert.ok(foo.get('isDirty'), 'foo is dirty');
    assert.ok(!bar.get('isDirty'), 'bar isn\'t dirty');
    assert.ok(baz.get('isDirty'), 'baz is dirty');
    assert.ok(quux.get('isDirty'), 'quux is dirty');

    foo.reload().then(function() {
      assert.ok(!foo.get('isDirty'), 'foo isn\'t dirty after foo.reload()');
      assert.ok(!bar.get('isDirty'), 'bar isn\'t dirty after foo.reload()');
      assert.ok(!baz.get('isDirty'), 'baz isn\'t dirty after foo.reload()');
      assert.ok(!quux.get('isDirty'), 'quux isn\'t dirty after foo.reload()');

      assert.ok(!quux.get('val'), 'quux value of `val` is rollbacked to `false`');
      done();
    });

  }.bind(this));

});

test("CleanEmbeddedChildrenMixin: call reload() on root record should process childs 'isDirty' state", function(assert) {

  var done = assert.async();
  Ember.run(function() {

    var store = setupTestData(this.store());

    var foo = store.all('foo').findBy('id', '1');
    var bar1 = store.all('bar').findBy('id', '1');
    var bar2 = store.all('bar').findBy('id', '2');

    assert.ok(!foo.get('isDirty'), 'foo isn\'t dirty');
    assert.ok(!bar1.get('isDirty'), 'bar1 isn\'t dirty');
    assert.ok(!bar2.get('isDirty'), 'bar2 isn\'t dirty');

    assert.ok(!bar2.get('val'), 'bar2 default value of `val` is `false`');
    bar2.set('val', true);
    assert.ok(bar2.get('val'), 'set bar2 value of `val` to `true`');

    assert.ok(foo.get('isDirty'), 'foo is dirty');
    assert.ok(!bar1.get('isDirty'), 'bar1 isn\'t dirty');
    assert.ok(bar2.get('isDirty'), 'bar2 is dirty');

    foo.reload().then(function() {
      assert.ok(!foo.get('isDirty'), 'foo isn\'t dirty after foo.reload()');
      assert.ok(!bar1.get('isDirty'), 'bar1 isn\'t dirty after foo.reload()');
      assert.ok(!bar2.get('isDirty'), 'bar2 isn\'t dirty after foo.reload()');

      done();
    });

  }.bind(this));

});
