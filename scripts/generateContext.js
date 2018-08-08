const fs = require('fs');
const path = require('path');

const getMetaData = require('../src/getMetaData');
const derivePrefix = require('../src/helpers/derivePrefix');
const deriveSingularTypes = require('../src/helpers/deriveSingularTypes');
const versions = require('../src/versions');

const generateContext = (version) => {
  let localVersion = version;
  if (typeof localVersion === 'undefined') {
    localVersion = 'latest';
  }
  if (typeof versions[localVersion] === 'undefined') {
    throw Error('Invalid specification version supplied');
  }

  const specVersion = versions[localVersion];

  const metaData = getMetaData(specVersion);

  const context = {
    concepts: {
      '@reverse': 'skos:inScheme',
    },
    '@vocab': metaData.namespaces[metaData.defaultPrefix],
  };

  const existing = {};
  const newModels = {};
  const newFields = {};

  const files = fs.readdirSync(path.join(__dirname, '..', 'src', specVersion, 'models'));

  for (const file of files) {
    if (file !== 'model_list.json') {
      const jsonPath = path.join(__dirname, '..', 'src', specVersion, 'models', file);
      const data = fs.readFileSync(jsonPath, 'utf8');
      const model = JSON.parse(data);

      let modelPrefix = metaData.openActivePrefix;
      const hasModelDerivedFrom = typeof model.derivedFrom !== 'undefined' && model.derivedFrom !== null;
      if (hasModelDerivedFrom) {
        modelPrefix = derivePrefix(model.derivedFrom, metaData.namespaces) || modelPrefix;
      }
      if (modelPrefix !== metaData.defaultPrefix) {
        const modelDerivedFromName = hasModelDerivedFrom
          ? model.derivedFrom.replace(metaData.namespaces[modelPrefix], '')
          : model.type;
        if (modelPrefix === metaData.openActivePrefix) {
          newModels[model.type] = `${modelPrefix}:${modelDerivedFromName}`;
        } else {
          existing[model.type] = `${modelPrefix}:${modelDerivedFromName}`;
        }
      }

      for (const fieldName in model.fields) {
        if (
          Object.prototype.hasOwnProperty.call(model.fields, fieldName)
          && typeof metaData.keywords[fieldName] === 'undefined'
          && !fieldName.match(/^@/)
        ) {
          const field = model.fields[fieldName];
          let fieldPrefix = modelPrefix;
          const hasFieldSameAs = typeof field.sameAs !== 'undefined' && field.sameAs !== null;
          if (hasFieldSameAs) {
            fieldPrefix = derivePrefix(field.sameAs, metaData.namespaces) || fieldPrefix;
          }
          if (fieldPrefix !== metaData.defaultPrefix) {
            const fieldSameAsName = hasFieldSameAs
              ? field.sameAs.replace(metaData.namespaces[fieldPrefix], '')
              : fieldName;
            if (fieldPrefix === metaData.openActivePrefix) {
              newFields[fieldName] = {
                '@id': `${fieldPrefix}:${fieldSameAsName}`,
              };
              const types = deriveSingularTypes(field);
              if (types.length === 1 && types[0].match(/^[A-Za-z]+$/)) {
                newFields[fieldName]['@type'] = '@id';
              }
            } else {
              existing[fieldName] = `${fieldPrefix}:${fieldSameAsName}`;
            }
          }
        }
      }
    }
  }

  return Object.assign(
    context,
    metaData.keywords,
    metaData.namespaces,
    existing,
    newModels,
    newFields,
  );
};

module.exports = generateContext;
