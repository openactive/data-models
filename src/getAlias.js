const fs = require('fs');
const path = require('path');

const getAlias = (name) => {
  if (!name.match(/^[A-Za-z]+$/) || name === 'model_list') {
    throw Error('Invalid model name supplied');
  }
  const jsonPath = path.join(__dirname, 'models', 'model_list.json');
  const data = fs.readFileSync(jsonPath, 'utf8');
  const modelList = JSON.parse(data);

  if (typeof modelList.type_aliases[name] !== 'undefined') {
    return modelList.type_aliases[name];
  }

  return null;
};

module.exports = getAlias;
