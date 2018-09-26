/*!
 * data-models
 * MIT Licensed
 */

const getFullyQualifiedProperty = require('./getFullyQualifiedProperty');
const loadEnum = require('./loadEnum');
const loadModel = require('./loadModel');
const getEnums = require('./getEnums');
const getExamples = require('./getExamples');
const getMetaData = require('./getMetaData');
const versions = require('./versions');

function createExports() {
  const root = {
    getEnums,
    getExamples,
    getFullyQualifiedProperty,
    getMetaData,
    loadEnum,
    loadModel,
    versions,
  };
  return root;
}

module.exports = createExports();
