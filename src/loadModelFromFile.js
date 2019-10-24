const fs = require('fs');
const path = require('path');
const loadModelCheckArgs = require('./helpers/loadModelCheckArgs');
const loadModelMergeParent = require('./helpers/loadModelMergeParent');

const loadModelFromFile = (name, version) => {
  const specVersion = loadModelCheckArgs(name, version);
  let jsonPath;
  if (name === 'FeedItem' || name === 'FeedPage') {
    jsonPath = path.join(__dirname, '..', 'versions', specVersion, 'rpde', `${name}.json`);
  } else {
    jsonPath = path.join(__dirname, '..', 'versions', specVersion, 'models', `${name}.json`);
  }
  const data = fs.readFileSync(jsonPath, 'utf8');
  let model = JSON.parse(data);
  if (typeof model.subClassOf !== 'undefined') {
    if (model.subClassOf.match(/^#[A-Za-z]+$/)) {
      const parentModelName = model.subClassOf.substr(1);
      const parentModel = loadModelFromFile(parentModelName, specVersion);
      // Note this brings derivedFrom of the parent into the current model, if no derivedFrom is set
      model = loadModelMergeParent(model, parentModel);
    } else if (typeof model.derivedFrom === 'undefined') {
      // If not set, set derivedFrom in the current model, if subClassOf is external
      model.derivedFrom = model.subClassOf;
    }
  }
  return model;
};

module.exports = loadModelFromFile;
