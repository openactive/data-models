const fs = require('fs');
const path = require('path');

const namespaces = require('./data/namespaces');
const keywords = require('./data/keywords');
const consts = require('./data/consts');
const derivePrefix = require('./helpers/derivePrefix');
const deriveSingularTypes = require('./helpers/deriveSingularTypes');

const getContext = () => {
  const context = {
    concepts: {
      '@reverse': 'skos:inScheme',
    },
    '@vocab': namespaces[consts.DEFAULT_PREFIX],
  };

  const existing = {};
  const newModels = {};
  const newFields = {};

  const files = fs.readdirSync(path.join(__dirname, 'models'));

  for (const file of files) {
    if (file !== 'model_list.json') {
      const jsonPath = path.join(__dirname, 'models', file);
      const data = fs.readFileSync(jsonPath, 'utf8');
      const model = JSON.parse(data);

      let modelPrefix = consts.OPEN_ACTIVE_PREFIX;
      const hasModelDerivedFrom = typeof model.derivedFrom !== 'undefined' && model.derivedFrom !== null;
      if (hasModelDerivedFrom) {
        modelPrefix = derivePrefix(model.derivedFrom) || modelPrefix;
      }
      if (modelPrefix !== consts.DEFAULT_PREFIX) {
        const modelDerivedFromName = hasModelDerivedFrom
          ? model.derivedFrom.replace(namespaces[modelPrefix], '')
          : model.type;
        if (modelPrefix === consts.OPEN_ACTIVE_PREFIX) {
          newModels[model.type] = `${modelPrefix}:${modelDerivedFromName}`;
        } else {
          existing[model.type] = `${modelPrefix}:${modelDerivedFromName}`;
        }
      }

      for (const fieldName in model.fields) {
        if (
          Object.prototype.hasOwnProperty.call(model.fields, fieldName)
          && typeof keywords[fieldName] === 'undefined'
          && !fieldName.match(/^@/)
        ) {
          const field = model.fields[fieldName];
          let fieldPrefix = modelPrefix;
          const hasFieldSameAs = typeof field.sameAs !== 'undefined' && field.sameAs !== null;
          if (hasFieldSameAs) {
            fieldPrefix = derivePrefix(field.sameAs) || fieldPrefix;
          }
          if (fieldPrefix !== consts.DEFAULT_PREFIX) {
            const fieldSameAsName = hasFieldSameAs
              ? field.sameAs.replace(namespaces[fieldPrefix], '')
              : fieldName;
            if (fieldPrefix === consts.OPEN_ACTIVE_PREFIX) {
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
    keywords,
    namespaces,
    existing,
    newModels,
    newFields,
  );
};

module.exports = getContext;
