const loadModelCheckArgs = require('./helpers/loadModelCheckArgs');
const specs = require('./dist/specs');

const loadModel = (name, version) => {
  const specVersion = loadModelCheckArgs(name, version);
  let jsonKey = 'models';
  if (name === 'FeedItem' || name === 'FeedPage') {
    jsonKey = 'rpde';
  }
  if (
    typeof specs[specVersion] === 'undefined'
    || typeof specs[specVersion].renderedModels[jsonKey] === 'undefined'
    || typeof specs[specVersion].renderedModels[jsonKey][name] === 'undefined'
  ) {
    throw Error(`Invalid model name "${name}" supplied`);
  }
  return specs[specVersion].renderedModels[jsonKey][name];
};

module.exports = loadModel;
