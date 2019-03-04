const { tagsForFolder } = require('../lib/folders');

const toJson = str => JSON.parse(str);

describe('tagsForFolder', () => {
  let container;
  beforeEach(() => {
    container = toJson(`
    {
      "containerVersion": {
          "tag": [
            {
              "tagId": "1",
              "name": "Tag 1",
              "parentFolderId": "3"
            },
            {
              "tagId": "2",
              "name": "Tag 2",
              "parentFolderId": "4"
            }
          ],
          "folder": [
              {
                  "folderId": "3",
                  "name": "Folder 3"
              },
              {
                  "folderId": "4",
                  "name": "Folder match 4"
              }
          ]
      }
    }`);
  })
  test('No match', () => {
    let results = tagsForFolder('xyz', container);
    expect(results.length).toBe(0);
  });

  test('Start of name match', () => {
    let results = tagsForFolder('Folder m', container);
    expect(results.length).toBe(1);
    expect(results[0].tagId).toEqual("2");

    results = tagsForFolder('Folder ', container);
    expect(results.length).toBe(2);
    expect(results.map(t => t.tagId)).toEqual(["1", "2"]);
  });

  test('Mid-name match', () => {
    let results = tagsForFolder('match', container);
    expect(results.length).toBe(1);
    expect(results[0].tagId).toEqual("2");

    results = tagsForFolder('der', container);
    expect(results.length).toBe(2);
    expect(results.map(t => t.tagId)).toEqual(["1", "2"]);
  });

  test('End of name match', () => {
    let results = tagsForFolder('4', container);
    expect(results.length).toBe(1);
    expect(results[0].tagId).toEqual("2");
  });

});
