const fs = require('fs');
const path = require('path');
const getAlias = require('./getAlias');

const loadModel = (name) => {
  if (!name.match(/^[A-Za-z]+$/) || name === 'model_list') {
    throw Error('Invalid model name supplied');
  }
  let modelName = name;
  const aliasName = getAlias(name);
  if (aliasName !== null) {
    modelName = aliasName;
  }
  const jsonPath = path.join(__dirname, 'models', `${modelName}.json`);
  const data = fs.readFileSync(jsonPath, 'utf8');
  const model = JSON.parse(data);
  return model;
};

module.exports = loadModel;
