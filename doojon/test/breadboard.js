import {Container} from '../src/breadboard.js';
import {Service} from '../src/model/service.js';
import t from 'tap';

t.test('Container', t => {
  const container = new Container();
  container.addService('test', {block: () => 1});

  t.equal(container.resolve('/test'), 1);

  class Test extends Service {
    static get deps() {
      return {'someDep': '/test'}
    }
  }

  container.addService('test2', {class: Test});

  const testInstance = container.resolve('/test2');

  t.ok(testInstance instanceof Test);
  t.equal(testInstance.someDep, 1);

  t.end();
})