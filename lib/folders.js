const escapeStringRegexp = require('escape-string-regexp');

module.exports.byName = (search, container) => {
  const allFolders = getAllFolders(container);
  const regex = new RegExp(escapeStringRegexp(search));
  return allFolders.filter(f => regex.test(f.name));
};

module.exports.tagsForFolder = function(search, container) {
  const allFolders = getAllFolders(container);
  const regex = new RegExp(escapeStringRegexp(search));
  const folderIdsToSearch = allFolders.filter(f => regex.test(f.name)).map(f => f.folderId);

  return container.containerVersion.tag.filter(t => folderIdsToSearch.includes(t.parentFolderId));
}

module.exports.forTags = (tags, container) => {
  const allFolders = getAllFolders(container);
  const folderIdsInTags = tags.filter(t => !!t.parentFolderId).map(t => t.parentFolderId);
  return allFolders.filter(f => folderIdsInTags.includes(f.folderId));
};

module.exports.forTriggers = (triggers, container) => {
  const allFolders = getAllFolders(container);
  const folderIdsInTriggers = triggers.filter(t => !!t.parentFolderId).map(t => t.parentFolderId);
  return allFolders.filter(f => folderIdsInTriggers.includes(f.folderId));
};

module.exports.forVariables = (variables, container) => {
  const allFolders = getAllFolders(container);
  const folderIdsInVariables = variables.filter(t => !!t.parentFolderId).map(t => t.parentFolderId);
  return allFolders.filter(f => folderIdsInVariables.includes(f.folderId));
};

function getAllFolders(container) {
  const allFolders = container.containerVersion.folder;
  if (!allFolders instanceof Array || !allFolders.length) {
    throw new Error('No folders found in container.')
  }
  return allFolders;
}
