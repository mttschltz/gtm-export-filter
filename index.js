const jsonfile = require('jsonfile');
const argv = require('yargs').argv;
const {
  byName: foldersByName,
  forTriggers: foldersForTriggers,
  forVariables: foldersForVariables
} = require('./lib/folders.js');
const { byFolderId: tagsByFolderId } = require('./lib/tags.js');
const { fromTag: triggersFromTag } = require('./lib/triggers.js');
const {
  fromTag: variablesFromTag,
  fromTrigger: variablesFromTrigger
} = require('./lib/variables.js');

const exportFormatVersionSupported = 2;

function getInputPath() {
  return argv.input;
}

function getContainer() {
  const input = getInputPath();
  let container;
  try {
    container = jsonfile.readFileSync(input);
  } catch (err) {
    return 'Please specify a valid input file.';
  }

  if (container.exportFormatVersion !== exportFormatVersionSupported) {
    return `exportFormatVersion in the input file is ${
      container.exportFormatVersion
    } but only ${exportFormatVersionSupported} is supported`;
  }
  return container;
}

function getConfig() {
  const configPath = argv.config;
  let config;
  try {
    config = jsonfile.readFileSync(configPath);
  } catch (err) {
    return 'Please specify a valid config file';
  }

  if (!!config.folders && !!config.tags) {
    return `Config file (${configPath}) does not contain a 'folders' or 'tags' array`;
  }
  return config;
}

const container = getContainer();
const config = getConfig();
if (typeof container === 'string') {
  console.error(container);
  process.exit(1);
}
if (typeof config === 'string') {
  console.error(config);
  process.exit(1);
}

// Get folder IDs for folder names
let folders = foldersByName(config.folders, container);
const rootFolderIds = folders.map(f => f.folderId);

// Get tags from folder names (or IDs):
let tags = [];
rootFolderIds.forEach(folderId => {
  tags = tags.concat(tagsByFolderId(folderId, container));
});

// Get triggers from tags and their folders
let triggers = [];
tags.forEach(tag => {
  triggers = triggers.concat(triggersFromTag(tag, container));
});
folders = folders.concat(foldersForTriggers(triggers, container));

// Get variables from tags and triggers
let variables = [];
tags.forEach(tag => {
  variables = variables.concat(variablesFromTag(tag, container));
});
triggers.forEach(trigger => {
  variables = variables.concat(variablesFromTrigger(trigger, container));
});

// Add variable's folders
folders = folders.concat(foldersForVariables(variables, container));

// Remove duplicate triggers, variables and folders
// The duplicate objects should be identical as they're all retrieved from `container`
triggers = [...new Set(triggers)];
folders = [...new Set(folders)];
variables = [...new Set(variables)];

// Take WHOLE container... replace tags with tags, trigs with trigs, vars with vars, folders with folders
container.containerVersion.folder = folders;
container.containerVersion.tag = tags;
container.containerVersion.trigger = triggers;
container.containerVersion.variable = variables;

// Write to new file
const inputPath = getInputPath();
const outputPath = inputPath.substring(0, inputPath.lastIndexOf('.')) + '-filtered.json';
jsonfile.writeFileSync(outputPath, container);
