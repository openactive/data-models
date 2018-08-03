const fs = require('fs');
const path = require('path');

const loadModel = (name) => {
  if (!name.match(/^[A-Za-z]+$/) || name === 'model_list') {
    throw Error('Invalid model name supplied');
  }
  let jsonPath;
  if (name === 'FeedItem' || name === 'FeedPage') {
    jsonPath = path.join(__dirname, 'rpde', `${name}.json`);
  } else {
    jsonPath = path.join(__dirname, 'models', `${name}.json`);
  }
  const data = fs.readFileSync(jsonPath, 'utf8');
  let model = JSON.parse(data);
  // Does this have a parent class?
  if (
    typeof model.subClassOf !== 'undefined'
    && model.subClassOf.match(/^#[A-Za-z]+$/)
  ) {
    const parentModelName = model.subClassOf.substr(1);
    const parentModel = loadModel(parentModelName);
    for (const field in parentModel.fields) {
      if (Object.prototype.hasOwnProperty.call(parentModel.fields, field)) {
        if (typeof parentModel.fields[field].inheritedFrom === 'undefined') {
          parentModel.fields[field].inheritedFrom = model.subClassOf;
        }
      }
    }
    model.fields = Object.assign(parentModel.fields, model.fields || {});
    model = Object.assign(parentModel, model);
    if (typeof model.subClassGraph === 'undefined') {
      model.subClassGraph = [];
    }
    model.subClassGraph.unshift(model.subClassOf);
  }
  return model;
};

module.exports = loadModel;
