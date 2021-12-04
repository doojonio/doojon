import { Container } from '../src/breadboard.js';
import t from 'tap';

t.test('Block', t => {
  const container = new Container();
  container.addService('test', { block: () => 1 });

  t.equal(container.resolve('/test'), 1);

  class Test {
    static get deps() {
      return { someDep: '/test' };
    }
  }

  container.addService('test2', { class: Test });

  const testInstance = container.resolve('/test2');

  t.ok(testInstance instanceof Test);
  t.equal(testInstance.someDep, 1);

  t.end();
});

t.test('OnInit', t => {
  const container = new Container();

  container.addService('some_dep', { block: () => 1 });
  let onInitCalled = false;
  class Test {
    static get deps() {
      return {
        someDep: '/some_dep'
      }
    }
    onInit() {
      t.equal(this.someDep, 1);
      onInitCalled = true;
    }
  }
  container.addService('test', { class: Test });
  const testInstance = container.resolve('/test');

  t.ok(onInitCalled, 'onInit called');

  t.end();
});

t.test('Circular dependency', t => {
  const container = new Container();

  class Test1 {
    static get deps() {
      return { test2: '/test2' };
    }
  }
  class Test2 {
    static get deps() {
      return { test1: '/test1' };
    }
  }

  container.addService('test1', { class: Test1 });
  container.addService('test2', { class: Test2 });

  t.throws(() => container.resolve('/test2'), new Error('circular dependency forbidden'));
  t.end();
})


t.test('Weak dependency', t => {
  const container = new Container();

  class Test1 {
    static get deps() {
      return { test2: '/test2' };
    }

    testFunction() {
      t.ok(this.test2 instanceof Test2);
      t.equal(this.test2.testFunction(), 'Test2')
      return 'Test1'
    }
  }
  class Test2 {
    static get deps() {
      return { 'test1': 'weak:/test1' };
    }

    testFunction() {
      return 'Test2'
    }

    testFunctionFromTest1() {
      t.ok(this.test1 instanceof WeakRef)
      t.ok(this.test1.deref() instanceof Test1);
      return this.test1.deref().testFunction();
    }
  }

  container.addService('test1', { class: Test1 });
  container.addService('test2', { class: Test2 });

  const test2 = container.resolve('/test2');

  t.ok(test2 instanceof Test2);
  t.equal(test2.testFunctionFromTest1(), 'Test1');

  t.end();
})
