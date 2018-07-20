/*!
 * data-models
 * MIT Licensed
 */

const getAlias = require('./getAlias');
const loadModel = require('./loadModel');

function createExports() {
  const root = {
    getAlias,
    loadModel,
  };
  return root;
}

module.exports = createExports();
