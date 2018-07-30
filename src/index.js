/*!
 * data-models
 * MIT Licensed
 */

const getFullyQualifiedProperty = require('./getFullyQualifiedProperty');
const loadModel = require('./loadModel');
const namespaces = require('./data/namespaces');

function createExports() {
  const root = {
    getFullyQualifiedProperty,
    loadModel,
    namespaces,
  };
  return root;
}

module.exports = createExports();
