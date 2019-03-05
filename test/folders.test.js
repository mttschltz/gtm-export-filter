const { byName, forTags, forTriggers, forVariables, tagsForFolder } = require('../lib/folders');

describe('tagsForFolder', () => {
  let container;
  beforeEach(() => {
    container = {
      containerVersion: {
        tag: [
          {
            tagId: '1',
            name: 'Tag 1',
            parentFolderId: '3'
          },
          {
            tagId: '2',
            name: 'Tag 2',
            parentFolderId: '4'
          }
        ],
        folder: [
          {
            folderId: '3',
            name: 'Folder 3'
          },
          {
            folderId: '4',
            name: 'Folder match 4'
          }
        ]
      }
    };
  });
  test('No match', () => {
    let results = tagsForFolder('xyz', container);
    expect(results.length).toBe(0);
  });

  test('Start of name match', () => {
    let results = tagsForFolder('Folder m', container);
    expect(results.length).toBe(1);
    expect(results[0].tagId).toEqual('2');

    results = tagsForFolder('Folder ', container);
    expect(results.length).toBe(2);
    expect(results.map(t => t.tagId)).toEqual(['1', '2']);
  });

  test('Mid-name match', () => {
    let results = tagsForFolder('match', container);
    expect(results.length).toBe(1);
    expect(results[0].tagId).toEqual('2');

    results = tagsForFolder('der', container);
    expect(results.length).toBe(2);
    expect(results.map(t => t.tagId)).toEqual(['1', '2']);
  });

  test('End of name match', () => {
    let results = tagsForFolder('4', container);
    expect(results.length).toBe(1);
    expect(results[0].tagId).toEqual('2');
  });
});

describe('byName', () => {
  let container;
  beforeEach(() => {
    container = {
      containerVersion: {
        folder: [
          {
            folderId: '1',
            name: 'Folder one'
          },
          {
            folderId: '2',
            name: 'Folder two'
          }
        ]
      }
    };
  });

  test('No match', () => {
    let results = byName('xyz', container);
    expect(results.length).toBe(0);
  });

  test('Match one', () => {
    let results = byName('one', container);
    expect(results).toEqual([
      {
        folderId: '1',
        name: 'Folder one'
      }
    ]);
  });

  test('Match two', () => {
    let results = byName('Folder', container);
    expect(results).toEqual([
      {
        folderId: '1',
        name: 'Folder one'
      },
      {
        folderId: '2',
        name: 'Folder two'
      }
    ]);
  });
});

describe('forTags', () => {
  let container;
  beforeEach(() => {
    container = {
      containerVersion: {
        folder: [
          {
            folderId: '1',
            name: 'Folder 1'
          },
          {
            folderId: '2',
            name: 'Folder match 2'
          },
          {
            folderId: '3',
            name: 'Folder match 3'
          }
        ]
      }
    };
  });

  test('No match', () => {
    let results = forTags([{ parentFolderId: '4' }, { parentFolderId: '5' }], container);
    expect(results.length).toBe(0);
  });

  test('Match multiple duplicates', () => {
    let results = forTags([{ parentFolderId: '1' }, { parentFolderId: '2' }], container);
    expect(results).toEqual([
      {
        folderId: '1',
        name: 'Folder 1'
      },
      {
        folderId: '2',
        name: 'Folder match 2'
      }
    ]);
  });

  test('Match multiple avoiding duplicates', () => {
    let results = forTags([{ parentFolderId: '1' }, { parentFolderId: '1' }], container);
    expect(results).toEqual([
      {
        folderId: '1',
        name: 'Folder 1'
      }
    ]);
  });
});

describe('forTriggers', () => {
  let container;
  beforeEach(() => {
    container = {
      containerVersion: {
        folder: [
          {
            folderId: '1',
            name: 'Folder 1'
          },
          {
            folderId: '2',
            name: 'Folder match 2'
          },
          {
            folderId: '3',
            name: 'Folder match 3'
          }
        ]
      }
    };
  });

  test('No match', () => {
    let results = forTriggers([{ parentFolderId: '4' }, { parentFolderId: '5' }], container);
    expect(results.length).toBe(0);
  });

  test('Match multiple duplicates', () => {
    let results = forTriggers([{ parentFolderId: '1' }, { parentFolderId: '2' }], container);
    expect(results).toEqual([
      {
        folderId: '1',
        name: 'Folder 1'
      },
      {
        folderId: '2',
        name: 'Folder match 2'
      }
    ]);
  });

  test('Match multiple avoiding duplicates', () => {
    let results = forTriggers([{ parentFolderId: '1' }, { parentFolderId: '1' }], container);
    expect(results).toEqual([
      {
        folderId: '1',
        name: 'Folder 1'
      }
    ]);
  });
});

describe('forVariables', () => {
  let container;
  beforeEach(() => {
    container = {
      containerVersion: {
        folder: [
          {
            folderId: '1',
            name: 'Folder 1'
          },
          {
            folderId: '2',
            name: 'Folder match 2'
          },
          {
            folderId: '3',
            name: 'Folder match 3'
          }
        ]
      }
    };
  });

  test('No match', () => {
    let results = forVariables([{ parentFolderId: '4' }, { parentFolderId: '5' }], container);
    expect(results.length).toBe(0);
  });

  test('Match multiple duplicates', () => {
    let results = forVariables([{ parentFolderId: '1' }, { parentFolderId: '2' }], container);
    expect(results).toEqual([
      {
        folderId: '1',
        name: 'Folder 1'
      },
      {
        folderId: '2',
        name: 'Folder match 2'
      }
    ]);
  });

  test('Match multiple avoiding duplicates', () => {
    let results = forVariables([{ parentFolderId: '1' }, { parentFolderId: '1' }], container);
    expect(results).toEqual([
      {
        folderId: '1',
        name: 'Folder 1'
      }
    ]);
  });
});
