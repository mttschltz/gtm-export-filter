const escapeStringRegexp = require('escape-string-regexp');

module.exports.byFolderId = (folderId, container) => {
  if (!container.containerVersion.tag || !container.containerVersion.tag.length) {
    throw new Errror('No tags found in container');
  }

  return container.containerVersion.tag.filter(t => t.parentFolderId === folderId);
};

module.exports.byName = (search, container) => {
  if (!container.containerVersion.tag || !container.containerVersion.tag.length) {
    return [];
  }

  const regex = new RegExp(escapeStringRegexp(search));
  return container.containerVersion.tag.filter(t => regex.test(t.name));
}
