/*!
 * data-models
 * MIT Licensed
 */

const getFullyQualifiedProperty = require('./getFullyQualifiedProperty');
const loadModel = require('./loadModel');
const consts = require('./data/consts');
const namespaces = require('./data/namespaces');

function createExports() {
  const root = {
    contextUrl: consts.CONTEXT_URL,
    getFullyQualifiedProperty,
    loadModel,
    namespaces,
  };
  return root;
}

module.exports = createExports();
