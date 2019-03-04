const fs = require('fs');
const argv = require('yargs').argv;
const folders = require('./lib/folders.js');

const exportFormatVersionSupported = 2;

function getContainer() {
  const input = argv.input;
  let rawData;
  try {
    rawData = fs.readFileSync(input);
  } catch (err) {
    return 'Please specify a valid input file.';
  }

  const container = JSON.parse(rawData);
  if (container.exportFormatVersion !== exportFormatVersionSupported) {
    return `exportFormatVersion in the input file is ${container.exportFormatVersion} but only ${exportFormatVersionSupported} is supported`;
  }
  return container;
}

const container = getContainer();
if (typeof container === 'string') {
  console.log(container);
  process.exit(1);
}
console.log(container);
folders();

// Can recursively make sure we get all dependencies!
// User:
// Specify regex for folders to keep
// Specify regex for individual tags to keep
// Specify regex for individual triggers to keep
// Specify regex for individual variables to keep

// Script:
// Find those variables and add to variablesById map
// Find the triggers and add to triggersById map
// ... find the variables depended on by the triggers and add to variablesById map
// Find the tags and add to tagsById map
// ... find the triggers depended on by the tags and add to triggersById map
// ... ... find the variables depended on by those triggers and add to variablesById map
// ... find the variables depended on by the tags and add to variablesById map
// Repeat for everything found in folders

// Let's rephrase the Script:
// Create 4 arrays: tags, triggers, variables, folders
// Use tag, trigger and variable regexes to add to the 4 arrays
// Use folder regexes to add to the 4 arrays
// Loop variables array and:
// 1) add to variablesById map
// Loop triggers array and:
// 1) add to triggersById map
// 2) add variable dependencies to  variablesById map
// Loop tags array and:
// 1) add to tagsById map
// 2) add to triggersById map
// 3) add variable dependencies to  variablesById map
// 

// Copy builtInVariable
// ALSO: Need to parse 'value's for {{ }} variables... i think they can be in all 3: tags, trigs, vars
// Add built in vars to stack first... because they are also used!!

// Tags return n folders, 1 tag, n triggers, n variables
// Triggers return: n folders, 1 trigger, n variables
// Variables return: n folder, n variables

// NEW VERSION
// 1. Copy build ins to buildInMap
// 2. Loop through desired folders for tags
// 3. Loop through desired tags
// 4. Combine into list of tags
// 5. Put into tagsMap
// 6. Loop through each, and:
// 7. Put referenced variables into varsMap (if not built in)
// 8. Put referenced triggers into trigsMap
// 9. Loop through trigsMap and put referenced vars into varsMap (if not built in/existing)
// 10. Loop through ALL for folders for foldersMap
// 11. Replace existing props with new ones: tags, trigs, vars, folders


// tag
//   vars:
//      param[x].value (param[x].type == TEMPLATE)
//   folder: parentFolderId (doesnt exist for unfiled items)
//   trigger: firingTriggerId[x], blockingTriggerId[x]
// 
// trigger
//   filter[x].parameter[y].value (param[y].type == TEMPLATE)
//   customEventFilter[x].parameter[y].value (param[y].type == TEMPLATE)
//   (both filter and customEventFilter can exist)
//   folder: parentFolderId (doesnt exist for unfiled items)
//
// TODO:
// variable parameter type == LIST.... loop through to look for nested vars: paramter[x](type==LIST).list[y].map[z].value

