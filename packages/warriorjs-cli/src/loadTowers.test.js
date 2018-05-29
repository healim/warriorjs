import findUp from 'find-up';
import mock from 'mock-fs';

import Tower from './Tower';
import loadTowers from './loadTowers';

jest.mock('find-up');
jest.mock('./Tower');

findUp.mockResolvedValue('/path/to/node_modules');

test('loads official towers', async () => {
  mock({
    '/path/to/node_modules': {
      '@warriorjs': {
        'tower-foo': {
          'package.json': '',
          'index.js': "module.exports = { name: 'foo', levels: [{ bar: 42 }] }",
        },
      },
    },
  });
  const towers = await loadTowers();
  mock.restore();
  expect(Tower).toHaveBeenCalledWith('foo', [{ bar: 42 }]);
  expect(towers.length).toBe(1);
  expect(towers[0]).toBeInstanceOf(Tower);
});

test('loads community towers', async () => {
  mock({
    '/path/to/node_modules': {
      'warriorjs-tower-foo': {
        'package.json': '',
        'index.js': "module.exports = { name: 'foo', levels: [{ bar: 42 }] }",
      },
    },
  });
  const towers = await loadTowers();
  mock.restore();
  expect(Tower).toHaveBeenCalledWith('foo', [{ bar: 42 }]);
  expect(towers.length).toBe(1);
  expect(towers[0]).toBeInstanceOf(Tower);
});

test("ignores directories that are seemingly towers but don't have a package.json", async () => {
  mock({
    '/path/to/node_modules': {
      '@warriorjs': {
        'tower-foo': {
          'index.js': "module.exports = { name: 'foo', levels: [{ bar: 42 }] }",
        },
      },
      'warriorjs-tower-bar': {
        'index.js': "module.exports = { name: 'bar', levels: [{ baz: 42 }] }",
      },
    },
  });
  const towers = await loadTowers();
  mock.restore();
  expect(Tower).not.toHaveBeenCalled();
  expect(towers.length).toBe(0);
});
