const { byName } = require('../lib/tags');

describe('byName', () => {
  let container;
  beforeEach(() => {
    container = {
      containerVersion: {
        tag: [
          {
            tagId: '1',
            name: 'Tag One Name'
          },
          {
            tagId: '2',
            name: 'Tag Two Name'
          },
          {
            tagId: '3',
            name: 'Tag Three Name'
          }
        ]
      }
    };
  });

  test('No matches', () => {
    expect(byName('foo', container)).toEqual([]);
  });

  test('One match', () => {
    expect(byName('One', container)).toEqual([
      {
        tagId: '1',
        name: 'Tag One Name'
      }
    ]);
  });

  test('Two matchs', () => {
    expect(byName('Tag T', container)).toEqual([
      {
        tagId: '2',
        name: 'Tag Two Name'
      },
      {
        tagId: '3',
        name: 'Tag Three Name'
      }
    ]);
  });

  test('Three matchs', () => {
    expect(byName('Name', container)).toEqual([
      {
        tagId: '1',
        name: 'Tag One Name'
      },
      {
        tagId: '2',
        name: 'Tag Two Name'
      },
      {
        tagId: '3',
        name: 'Tag Three Name'
      }
    ]);
  });
});
