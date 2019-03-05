const { fromTag } = require('../lib/triggers');

describe('fromTag', () => {
  let container;
  let tag;
  beforeEach(() => {
    container = {
      containerVersion: {
        trigger: [
          {
            triggerId: '1',
            name: 'Trigger 1 Name'
          },
          {
            triggerId: '2',
            name: 'Trigger 2 Name'
          },
          {
            triggerId: '3',
            name: 'Trigger 3 Name'
          }
        ]
      }
    };
  });

  test('No matches', () => {
    expect(
      fromTag(
        {
          tagId: '1',
          name: 'Tag One Name'
        },
        container
      )
    ).toEqual([]);
  });

  test('One `firingTriggerId` match', () => {
    expect(
      fromTag(
        {
          tagId: '1',
          name: 'Tag One Name',
          firingTriggerId: ['1']
        },
        container
      )
    ).toEqual([
      {
        triggerId: '1',
        name: 'Trigger 1 Name'
      }
    ]);
  });

  test('One `blockingTriggerId` match', () => {
    expect(
      fromTag(
        {
          tagId: '1',
          name: 'Tag One Name',
          blockingTriggerId: ['1']
        },
        container
      )
    ).toEqual([
      {
        triggerId: '1',
        name: 'Trigger 1 Name'
      }
    ]);
  });

  test('One `firingTriggerId` and two `blockingTriggerId` match', () => {
    expect(
      fromTag(
        {
          tagId: '1',
          name: 'Tag One Name',
          firingTriggerId: ['1'],
          blockingTriggerId: ['2', '3']
        },
        container
      )
    ).toEqual([
      {
        triggerId: '1',
        name: 'Trigger 1 Name'
      },
      {
        triggerId: '2',
        name: 'Trigger 2 Name'
      },
      {
        triggerId: '3',
        name: 'Trigger 3 Name'
      }
    ]);
  });

  test('No duplicates between `firingTriggerId` and `blockingTriggerId` matches', () => {
    expect(
      fromTag(
        {
          tagId: '1',
          name: 'Tag One Name',
          firingTriggerId: ['1'],
          blockingTriggerId: ['1']
        },
        container
      )
    ).toEqual([
      {
        triggerId: '1',
        name: 'Trigger 1 Name'
      }
    ]);
  });
});
