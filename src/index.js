/*!
 * data-models
 * MIT Licensed
 */

const getContext = require('./getContext');
const getEnums = require('./getEnums');
const getModels = require('./getModels');
const getProperties = require('./getProperties');
const getExamples = require('./getExamples');
const getExamplesWithContent = require('./getExamplesWithContent');
const getFullyQualifiedProperty = require('./getFullyQualifiedProperty');
const getGraph = require('./getGraph');
const getMetaData = require('./getMetaData');
const loadEnum = require('./loadEnum');
const loadModel = require('./loadModel');
const versions = require('./versions');
const getSchemaOrgVocab = require('./getSchemaOrgVocab');

function createExports() {
  const root = {
    getContext,
    getEnums,
    getModels,
    getProperties,
    getExamples,
    getExamplesWithContent,
    getFullyQualifiedProperty,
    getGraph,
    getMetaData,
    loadEnum,
    loadModel,
    versions,
    getSchemaOrgVocab,
  };
  return root;
}

module.exports = createExports();
