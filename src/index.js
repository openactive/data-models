/*!
 * data-models
 * MIT Licensed
 */

const loadModel = require('./loadModel');

function createExports() {
  const root = {
    loadModel,
  };
  return root;
}

module.exports = createExports();
