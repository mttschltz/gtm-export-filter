const escapeStringRegexp = require('escape-string-regexp');

module.exports.fromTag = (tag, container) => {
  if (!container.containerVersion.trigger || !container.containerVersion.trigger) {
    throw new Error(`No triggers found in the container.`);
  }

  let triggerIds = (tag.firingTriggerId || []).concat(tag.blockingTriggerId || [])
  return container.containerVersion.trigger.filter(t => triggerIds.includes(t.triggerId));
}
