const escapeStringRegexp = require('escape-string-regexp');

module.exports.byName = (search, container) => {
  if (!container.containerVersion.tag || !container.containerVersion.tag.length) {
    return [];
  }

  const regex = new RegExp(escapeStringRegexp(search));
  return container.containerVersion.tag.filter(t => regex.test(t.name));
}
