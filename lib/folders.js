const escapeStringRegexp = require('escape-string-regexp');

module.exports.tagsForFolder = function(search, container) {
  const allFolders = container.containerVersion.folder;
  if (!allFolders instanceof Array || !allFolders.length) {
    throw Error('No folders found in container.')
  }
  const regex = new RegExp(escapeStringRegexp(search));
  const folderIdsToSearch = allFolders.filter(f => regex.test(f.name)).map(f => f.folderId);

  return container.containerVersion.tag.filter(t => folderIdsToSearch.includes(t.parentFolderId));
}
