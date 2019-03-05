const escapeStringRegexp = require('escape-string-regexp');

module.exports.fromTag = (tag, container) => {
  if (!tag.parameter || !tag.parameter.length) {
    throw new Error('No parameters found for tag.');
  }

  // Parse names from tag parameter values
  const variableNames = tag.parameter
    .filter(p => p.type === 'TEMPLATE')
    .filter(p => /\{\{.+\}\}/.test(p.value))
    .reduce((acc, p) => acc.concat(namesFromString(p.value)), []);

  // Return full variables that match the names found
  const variables = container.containerVersion.variable.filter(v => variableNames.includes(v.name));
  let nestedVariables = [];
  variables.forEach(v => {
    nestedVariables = nestedVariables.concat(fromVariable(v, container));
  });

  return variables.concat(nestedVariables);
};
 
module.exports.fromTrigger = (trigger, container) => {
  // Get all parameters from filter types
  let parameters = [];
  if (trigger.filter && trigger.filter.length) {
    trigger.filter.forEach(f => parameters = parameters.concat(f.parameter));
  }
  if (trigger.autoEventFilter && trigger.autoEventFilter.length) {
    trigger.autoEventFilter.forEach(f => parameters = parameters.concat(f.parameter));
  }
  if (trigger.customEventFilter && trigger.customEventFilter.length) {
    trigger.customEventFilter.forEach(f => parameters = parameters.concat(f.parameter));
  }

  // Parse parameters for variable names (removing duplicates)
  let variableNames = parameters
    .filter(p => p.type === 'TEMPLATE')
    .filter(p => /\{\{.+\}\}/.test(p.value))
    .reduce((acc, p) => acc.concat(namesFromString(p.value)), []);

  variablesNames = [...new Set(variableNames)];

  // Return full variables that match the names found
  const topLevelVariables = container.containerVersion.variable.filter(v => variableNames.includes(v.name));
  
  // Find nested variables and avoid duplicates
  let allVariablesMap = {};
  topLevelVariables.forEach(v => {
    allVariablesMap[v.variableId] = v;
    fromVariable(v, container).forEach(nv => {
      allVariablesMap[nv.variableId] = nv;
    });
  });

  return Object.values(allVariablesMap);
};

function fromVariable(variable, container) {
  // Parse names from root parameter values
  const variableNames = variable.parameter
    .filter(p => p.type === 'TEMPLATE')
    .filter(p => /\{\{.+\}\}/.test(p.value))
    .reduce((acc, p) => acc.concat(namesFromString(p.value)), []);

  let variableNamesFromList = [];
  variable.parameter
    .filter(p => p.type === 'LIST')
    .forEach(p => {
      const nestedValues = p.list
        .map(l => l.map.map(m => m.value))
        .reduce((acc, maps) => acc.concat(maps), []);
      nestedValues.forEach(v => {
        const names = namesFromString(v);
        variableNamesFromList = variableNamesFromList.concat(names);
      });
    });

  const allVariableNames = variableNames.concat(variableNamesFromList);

  const firstLevelVariables = container.containerVersion.variable.filter(v =>
    allVariableNames.includes(v.name)
  );
  let nestedVariables = [];
  firstLevelVariables.forEach(v => {
    nestedVariables = nestedVariables.concat(fromVariable(v, container));
  });

  // Return without duplicates
  return [...new Set(firstLevelVariables.concat(nestedVariables))];
}

module.exports.fromVariable = fromVariable;

function namesFromString(str) {
  const regex = /\{\{([^\}]+)\}\}/g;
  let result;
  let names = [];
  while ((result = regex.exec(str)) !== null) {
    names.push(result[1]);
  }
  return names;
}
