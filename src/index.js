/*!
 * data-models
 * MIT Licensed
 */

const getFullyQualifiedProperty = require('./getFullyQualifiedProperty');
const loadModel = require('./loadModel');
const getExamples = require('./getExamples');
const getMetaData = require('./getMetaData');
const versions = require('./versions');

function createExports() {
  const root = {
    getExamples,
    getFullyQualifiedProperty,
    getMetaData,
    loadModel,
    versions,
  };
  return root;
}

module.exports = createExports();
