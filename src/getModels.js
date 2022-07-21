const specs = require('./dist/specs');
const deriveVersion = require('./helpers/deriveVersion');

const getModels = (version) => {
  const specVersion = deriveVersion(version);
  if (
    typeof specs[specVersion] === 'undefined'
    || typeof specs[specVersion].rawModels.models === 'undefined'
  ) {
    throw Error(`Invalid specification version "${specVersion}" supplied`);
  }
  return specs[specVersion].rawModels.models;
};

module.exports = getModels;
