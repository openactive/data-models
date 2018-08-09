/*!
 * data-models
 * MIT Licensed
 */

const getFullyQualifiedProperty = require('./getFullyQualifiedProperty');
const loadModel = require('./loadModel');
const getMetaData = require('./getMetaData');
const versions = require('./versions');

function createExports() {
  const root = {
    getFullyQualifiedProperty,
    getMetaData,
    loadModel,
    versions,
  };
  return root;
}

module.exports = createExports();
