const loadModelMergeParent = require('./loadModelMergeParent');

const renderModel = (rawModel, modelLoadFn) => {
  // Deep clone raw model, to protect it from mutation by the logic below
  // TODO: To increase build performance update the below to not mutate either the model or parentModel, then remove deep clone
  let model = JSON.parse(JSON.stringify(rawModel));
  if (typeof model.subClassOf !== 'undefined') {
    if (model.subClassOf.match(/^#[A-Za-z]+$/)) {
      const parentModelName = model.subClassOf.substr(1);
      const parentModel = modelLoadFn(parentModelName);
      model = loadModelMergeParent(model, parentModel);
    } else {
      model.baseSchemaClass = model.subClassOf;
    }
  } else {
    model.baseSchemaClass = model.derivedFrom;
  }
  return model;
};

module.exports = renderModel;
