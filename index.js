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

// Get folder IDs for folder names


// Get tags from folder names (or IDs):
// Get variables from tags + add variable's folders
// Get triggers from tags + add trigger's folders
// Get variables from triggers + add variable's folders
// Take WHOLE container... replace tags with tags, trigs with trigs, vars with vars, folders with folders
