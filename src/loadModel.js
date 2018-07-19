const fs = require('fs');
const path = require('path');

const loadModel = (name) => {
  if (!name.match(/^[A-Za-z]+$/)) {
    throw Error('Invalid model name supplied');
  }
  const jsonPath = path.join(__dirname, 'models', `${name}.json`);
  const data = fs.readFileSync(jsonPath, 'utf8');
  const model = JSON.parse(data);
  return model;
};

module.exports = loadModel;
