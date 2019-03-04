const { fromTag, fromTrigger, fromVariable } = require('../lib/variables');

describe('fromTag', () => {
  let container;
  beforeEach(() => {
    container = {
      containerVersion: {
        tag: [],
        variable: [
          {
            variableId: '1',
            name: 'Variable 1',
            parameter: [
              {
                type: 'TEMPLATE',
                key: 'javascript',
                value: "function() {\\n return 'hello'};}"
              }
            ]
          },
          {
            variableId: '2',
            name: 'Variable 2',
            parameter: [
              {
                type: 'INTEGER',
                key: 'dataLayerVersion',
                value: '2'
              }
            ]
          },
          {
            variableId: '3',
            name: 'Variable 3',
            parameter: [
              {
                type: 'TEMPLATE',
                key: 'javascript',
                value: 'function() {\\n return {{Variable 2}};}'
              }
            ]
          }
        ]
      }
    };
  });

  test('Find no variables', () => {
    container.containerVersion.tag.push({
      tagId: '1',
      name: 'Tag 1 Name',
      parameter: [
        {
          type: 'TEMPLATE',
          key: 'html',
          value: "hello"
        }
      ]
    });
    let results = fromTag(container.containerVersion.tag[0], container);
    expect(results.length).toBe(0);
  });

  test('Ignore missing variable (assume is built-in)', () => {
    container.containerVersion.tag.push({
      tagId: '1',
      name: 'Tag 1 Name',
      parameter: [
        {
          type: 'TEMPLATE',
          key: 'html',
          value: "<script>var var1 = '{{Built-in Variable}}';</script>"
        }
      ]
    });
    let results = fromTag(container.containerVersion.tag[0], container);
    expect(results.length).toBe(0);
  });

  test('Find multiple variables in one parameter', () => {
    container.containerVersion.tag.push({
      tagId: '1',
      name: 'Tag 1 Name',
      parameter: [
        {
          type: 'TEMPLATE',
          key: 'html',
          value: "<script>var var1 = '{{Variable 1}}';var var2 = '{{Variable 2}}';</script>"
        },
        {
          type: 'BOOLEAN',
          key: 'supportDocumentWrite',
          value: 'false'
        }
      ]
    });
    let results = fromTag(container.containerVersion.tag[0], container);
    expect(results.length).toBe(2);
    expectContainsVariablesWithIds(results, '1', '2');
  });

  test('Find multiple variables across multiple parameter', () => {
    container.containerVersion.tag.push({
      tagId: '2',
      name: 'Tag 2 Name',
      parameter: [
        {
          type: 'TEMPLATE',
          key: 'eventValue',
          value: '{{Variable 1}}'
        },
        {
          type: 'TEMPLATE',
          key: 'gaSettings',
          value: '{{Variable 2}}'
        }
      ]
    });
    let results = fromTag(container.containerVersion.tag[0], container);
    expect(results.length).toBe(2);
    expectContainsVariablesWithIds(results, '1', '2');
  });

  test('Find nested variables', () => {
    container.containerVersion.tag.push({
      tagId: '2',
      name: 'Tag 2 Name',
      parameter: [
        {
          type: 'TEMPLATE',
          key: 'eventValue',
          value: '{{Variable 3}}'
        }
      ]
    });
    let results = fromTag(container.containerVersion.tag[0], container);
    expect(results.length).toBe(2);
    expectContainsVariablesWithIds(results, '3', '2');
  });
});

describe('fromTrigger', () => {
  let container;
  beforeEach(() => {
    container = {
      containerVersion: {
        trigger: [],
        variable: [
          {
            variableId: '1',
            name: 'Variable 1',
            parameter: [
              {
                type: 'TEMPLATE',
                key: 'javascript',
                value: "function() {\\n return 'hello'};}"
              }
            ]
          },
          {
            variableId: '2',
            name: 'Variable 2',
            parameter: [
              {
                type: 'INTEGER',
                key: 'dataLayerVersion',
                value: '2'
              }
            ]
          },
          {
            variableId: '3',
            name: 'Variable 3',
            parameter: [
              {
                type: 'TEMPLATE',
                key: 'javascript',
                value: 'function() {\\n return {{Variable 2}};}'
              }
            ]
          }
        ]
      }
    };
  });

  test('Find no variables', () => {
    container.containerVersion.trigger.push({
      triggerId: '1',
      name: 'Trigger 1 Name',
      filter: [
        {
          type: 'EQUALS',
          parameter: [
            {
              type: 'TEMPLATE',
              key: 'html',
              value: "hello"
            }
          ]
        }
      ]
    });
    let results = fromTrigger(container.containerVersion.trigger[0], container);
    expect(results.length).toBe(0);
  });

  test('Ignore missing variable (assume is built-in)', () => {
    container.containerVersion.trigger.push({
      triggerId: '1',
      name: 'Trigger 1 Name',
      filter: [
        {
          type: 'EQUALS',
          parameter: [
            {
              type: 'TEMPLATE',
              key: 'html',
              value: "<script>var var1 = '{{Built-in Variable}}';</script>"
            }
          ]
        }
      ]
    });
    let results = fromTrigger(container.containerVersion.trigger[0], container);
    expect(results.length).toBe(0);
  });

  test('Find multiple variables in same `filter` parameters', () => {
    container.containerVersion.trigger.push({
      triggerId: '1',
      name: 'Trigger 1 Name',
      filter: [
        {
          type: 'EQUALS',
          parameter: [
            {
              type: 'TEMPLATE',
              key: 'html',
              value: "<script>var var1 = '{{Variable 1}}';var var2 = '{{Variable 2}}';</script>"
            }
          ]
        }
      ]
    });
    let results = fromTrigger(container.containerVersion.trigger[0], container);
    expect(results.length).toBe(2);
    expectContainsVariablesWithIds(results, '1', '2');
  });

  test('Find multiple and nested variables in different `filter` parameters', () => {
    container.containerVersion.trigger.push({
      triggerId: '1',
      name: 'Trigger 1 Name',
      filter: [
        {
          type: 'EQUALS',
          parameter: [
            {
              type: 'TEMPLATE',
              key: 'html',
              value: "<script>var var1 = '{{Variable 1}}';</script>"
            },
            {
              type: 'TEMPLATE',
              key: 'html',
              value: "<script>var var2 = '{{Variable 3}}';</script>"
            }
          ]
        }
      ]
    });
    let results = fromTrigger(container.containerVersion.trigger[0], container);
    expect(results.length).toBe(3);
    expectContainsVariablesWithIds(results, '1', '2', '3');
  });
  test('Find multiple variables in same `autoEventFilter` parameters', () => {
    container.containerVersion.trigger.push({
      triggerId: '1',
      name: 'Trigger 1 Name',
      autoEventFilter: [
        {
          type: 'EQUALS',
          parameter: [
            {
              type: 'TEMPLATE',
              key: 'html',
              value: "<script>var var1 = '{{Variable 1}}';var var2 = '{{Variable 2}}';</script>"
            }
          ]
        }
      ]
    });
    let results = fromTrigger(container.containerVersion.trigger[0], container);
    expect(results.length).toBe(2);
    expectContainsVariablesWithIds(results, '1', '2');
  });

  test('Find multiple and nested variables in different `autoEventFilter` parameters', () => {
    container.containerVersion.trigger.push({
      triggerId: '1',
      name: 'Trigger 1 Name',
      autoEventFilter: [
        {
          type: 'EQUALS',
          parameter: [
            {
              type: 'TEMPLATE',
              key: 'html',
              value: "<script>var var1 = '{{Variable 1}}';</script>"
            },
            {
              type: 'TEMPLATE',
              key: 'html',
              value: "<script>var var2 = '{{Variable 3}}';</script>"
            }
          ]
        }
      ]
    });
    let results = fromTrigger(container.containerVersion.trigger[0], container);
    expect(results.length).toBe(3);
    expectContainsVariablesWithIds(results, '1', '2', '3');
  });
  test('Find multiple variables in same `customEventFilter` parameters', () => {
    container.containerVersion.trigger.push({
      triggerId: '1',
      name: 'Trigger 1 Name',
      customEventFilter: [
        {
          type: 'EQUALS',
          parameter: [
            {
              type: 'TEMPLATE',
              key: 'html',
              value: "<script>var var1 = '{{Variable 1}}';var var2 = '{{Variable 2}}';</script>"
            }
          ]
        }
      ]
    });
    let results = fromTrigger(container.containerVersion.trigger[0], container);
    expect(results.length).toBe(2);
    expectContainsVariablesWithIds(results, '1', '2');
  });

  test('Find multiple and nested variables in different `customEventFilter` parameters', () => {
    container.containerVersion.trigger.push({
      triggerId: '1',
      name: 'Trigger 1 Name',
      customEventFilter: [
        {
          type: 'EQUALS',
          parameter: [
            {
              type: 'TEMPLATE',
              key: 'html',
              value: "<script>var var1 = '{{Variable 1}}';</script>"
            },
            {
              type: 'TEMPLATE',
              key: 'html',
              value: "<script>var var2 = '{{Variable 3}}';</script>"
            }
          ]
        }
      ]
    });
    let results = fromTrigger(container.containerVersion.trigger[0], container);
    expect(results.length).toBe(3);
    expectContainsVariablesWithIds(results, '1', '2', '3');
  });

  test('Find multiple and nested variables across `filter`, `autoEventFilter`, and `customEventFilter` parameters', () => {
    container.containerVersion.variable.push(
      {
        variableId: '4',
        name: 'Variable 4',
        parameter: [
          {
            type: 'INTEGER',
            key: 'dataLayerVersion',
            value: '2'
          }
        ]
      }
    );
    container.containerVersion.trigger.push({
      triggerId: '1',
      name: 'Trigger 1 Name',
      filter: [
        {
          type: 'EQUALS',
          parameter: [
            {
              type: 'TEMPLATE',
              key: 'html',
              value: "<script>var var1 = '{{Variable 1}}';</script>"
            }
          ]
        }
      ],
      autoEventFilter: [
        {
          type: 'EQUALS',
          parameter: [
            {
              type: 'TEMPLATE',
              key: 'html',
              value: "<script>var var1 = '{{Variable 1}}'; var var1 = '{{Variable 2}}';</script>"
            }
          ]
        }
      ],
      customEventFilter: [
        {
          type: 'EQUALS',
          parameter: [
            {
              type: 'TEMPLATE',
              key: 'html',
              value: "<script>var var1 = '{{Variable 3}}'; var var1 = '{{Variable 4}}';</script>"
            }
          ]
        }
      ]
    });
    let results = fromTrigger(container.containerVersion.trigger[0], container);
    expect(results.length).toBe(4);
    expectContainsVariablesWithIds(results, '1', '2', '3', '4');
  });

});

describe('fromVariable', () => {
  let container;
  beforeEach(() => {
    container = {
      containerVersion: {
        variable: [
          {
            variableId: '1',
            name: 'Variable 1',
            parameter: [
              {
                type: 'TEMPLATE',
                value: "function() {\\n return 'hello'};}"
              }
            ]
          },
          {
            variableId: '2',
            name: 'Variable 2',
            parameter: [
              {
                type: 'TEMPLATE',
                value: "function() {\\n return 'hello'};}"
              }
            ]
          },
          {
            variableId: '3',
            name: 'Variable 3',
            parameter: [
              {
                type: 'TEMPLATE',
                value: "function() {\\n return '{{Variable 1}}';}"
              }
            ]
          }
        ]
      }
    };
  });

  test('Find no variables', () => {
    let results = fromVariable(container.containerVersion.variable[0], container);
    expect(results.length).toBe(0);
  });

  test('Ignore missing variable (assume is built-in)', () => {
    container.containerVersion.variable.push({
      variableId: '4',
      name: 'Variable 4',
      parameter: [
        {
          type: 'TEMPLATE',
          value: "function() {\\n return '{{Built-in Variable}}';}"
        }
      ]
    });
    let results = fromVariable(container.containerVersion.variable[3], container);
    expect(results.length).toBe(0);
  });

  test('One first level match', () => {
    let results = fromVariable(container.containerVersion.variable[2], container);
    expect(results.length).toBe(1);
    expect(results[0]).toHaveProperty('variableId', '1');
  });

  test('One first level match, one second level match', () => {
    container.containerVersion.variable.push({
      variableId: '4',
      name: 'Variable 4',
      parameter: [
        {
          type: 'TEMPLATE',
          value: "function() {\\n return '{{Variable 3}}';}"
        }
      ]
    });
    let results = fromVariable(container.containerVersion.variable[3], container);
    expect(results.length).toBe(2);
    expect(results.map(v => v.variableId).sort()).toEqual(['3', '1'].sort());
  });

  test('Two first level matches and one second level', () => {
    container.containerVersion.variable.push({
      variableId: '4',
      name: 'Variable 4',
      parameter: [
        {
          type: 'TEMPLATE',
          value: "function() {\\n return '{{Variable 3}}' || '{{Variable 2}}';}"
        }
      ]
    });
    let results = fromVariable(container.containerVersion.variable[3], container);
    expect(results.length).toBe(3);
    expect(results.map(v => v.variableId).sort()).toEqual(['3', '2', '1'].sort());
  });

  test('Two first level matches and one second level', () => {
    container.containerVersion.variable.push(
      {
        variableId: '4',
        name: 'Variable 4',
        parameter: [
          {
            type: 'TEMPLATE',
            value: "function() {\\n return 'hello'};}"
          }
        ]
      },
      {
        variableId: '5',
        name: 'Variable 5',
        parameter: [
          {
            type: 'BOOLEAN',
            key: 'setDefaultValue',
            value: 'false'
          },
          {
            type: 'TEMPLATE',
            key: 'input',
            value: '{{Variable 2}}'
          },
          {
            type: 'LIST',
            key: 'map',
            list: [
              {
                type: 'MAP',
                map: [
                  {
                    type: 'TEMPLATE',
                    key: 'key',
                    value: 'Value'
                  },
                  {
                    type: 'TEMPLATE',
                    key: 'value',
                    value: '{{Variable 3}}'
                  }
                ]
              },
              {
                type: 'MAP',
                map: [
                  {
                    type: 'TEMPLATE',
                    key: 'value',
                    value: '{{Variable 4}}'
                  }
                ]
              }
            ]
          }
        ]
      }
    );

    let results = fromVariable(container.containerVersion.variable[4], container);
    expect(results.length).toBe(4);
    expect(results.map(v => v.variableId).sort()).toEqual(['2', '3', '1', '4'].sort());
  });
});

function expectContainsVariablesWithIds(results, ...variables) {
  expect(results.map(v => v.variableId).sort()).toEqual(variables.sort());
}
