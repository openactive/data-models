const fs = require('fs');
const path = require('path');
const loadModelCheckArgs = require('./helpers/loadModelCheckArgs');
const renderModel = require('./helpers/renderModel');

const loadModelFromFile = (name, version) => {
  const specVersion = loadModelCheckArgs(name, version);
  let jsonPath;
  if (name === 'FeedItem' || name === 'FeedPage') {
    jsonPath = path.join(__dirname, '..', 'versions', specVersion, 'rpde', `${name}.json`);
  } else {
    jsonPath = path.join(__dirname, '..', 'versions', specVersion, 'models', `${name}.json`);
  }
  const data = fs.readFileSync(jsonPath, 'utf8');
  const model = JSON.parse(data);
  return renderModel(model, modelName => loadModelFromFile(modelName, specVersion));
};

module.exports = loadModelFromFile;
