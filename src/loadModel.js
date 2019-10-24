const loadModelCheckArgs = require('./helpers/loadModelCheckArgs');
const loadModelMergeParent = require('./helpers/loadModelMergeParent');
const specs = require('./dist/specs');

const loadModel = (name, version) => {
  const specVersion = loadModelCheckArgs(name, version);
  let jsonKey = 'models';
  if (name === 'FeedItem' || name === 'FeedPage') {
    jsonKey = 'rpde';
  }
  if (
    typeof specs[specVersion] === 'undefined'
    || typeof specs[specVersion][jsonKey] === 'undefined'
    || typeof specs[specVersion][jsonKey][name] === 'undefined'
  ) {
    throw Error(`Invalid model name "${name}" supplied`);
  }
  let model = Object.assign({}, specs[specVersion][jsonKey][name]);
  if (typeof model.subClassOf !== 'undefined') {
    if (model.subClassOf.match(/^#[A-Za-z]+$/)) {
      const parentModelName = model.subClassOf.substr(1);
      const parentModel = loadModel(parentModelName, specVersion);
      // Note this brings derivedFrom of the parent into the current model, if no derivedFrom is set
      model = loadModelMergeParent(model, parentModel);
    } else if (typeof model.derivedFrom === 'undefined') {
      // If not set, set derivedFrom in the current model, if subClassOf is external
      model.derivedFrom = model.subClassOf;
    }
  }
  return model;
};

module.exports = loadModel;
