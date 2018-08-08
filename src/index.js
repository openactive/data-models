/*!
 * data-models
 * MIT Licensed
 */

const getFullyQualifiedProperty = require('./getFullyQualifiedProperty');
const loadModelFromDist = require('./loadModelFromDist');
const getMetaData = require('./getMetaData');
const versions = require('./versions');

function createExports() {
  const root = {
    getFullyQualifiedProperty,
    getMetaData,
    loadModel: loadModelFromDist,
    versions,
  };
  return root;
}

module.exports = createExports();
