/*!
 * data-models
 * MIT Licensed
 */

const getContext = require('./getContext');
const getEnums = require('./getEnums');
const getExamples = require('./getExamples');
const getFullyQualifiedProperty = require('./getFullyQualifiedProperty');
const getGraph = require('./getGraph');
const getMetaData = require('./getMetaData');
const loadEnum = require('./loadEnum');
const loadModel = require('./loadModel');
const versions = require('./versions');

function createExports() {
  const root = {
    getContext,
    getEnums,
    getExamples,
    getFullyQualifiedProperty,
    getGraph,
    getMetaData,
    loadEnum,
    loadModel,
    versions,
  };
  return root;
}

module.exports = createExports();
