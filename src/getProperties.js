const properties = require('./dist/properties');
const deriveVersion = require('./helpers/deriveVersion');

const getProperties = (version) => {
  const specVersion = deriveVersion(version);
  return properties[specVersion];
};

module.exports = getProperties;
