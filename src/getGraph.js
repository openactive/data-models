// TODO:
// - rdfs:domain
// - rdfs:subPropertyOf
// - comments
// - GenderRestrictionTypes

const fs = require('fs');
const path = require('path');

const namespaces = require('./data/namespaces');
const keywords = require('./data/keywords');
const consts = require('./data/consts');
const graph = require('./data/graph');
const derivePrefix = require('./helpers/derivePrefix');
const deriveSingularTypes = require('./helpers/deriveSingularTypes');

const getGraph = () => {
  const metaData = {
    '@id': namespaces[consts.OPEN_ACTIVE_PREFIX],
    'dc:date': (new Date()).toISOString().replace(/T.*$/, ''),
    'owl:versionInfo': '#',
  };
  const propsAndClasses = {
    rdfs_classes: [],
    rdfs_properties: [],
  };
  const files = fs.readdirSync(path.join(__dirname, 'models'));
  for (const file of files) {
    if (file !== 'model_list.json') {
      const jsonPath = path.join(__dirname, 'models', file);
      const data = fs.readFileSync(jsonPath, 'utf8');
      const model = JSON.parse(data);

      if (file !== 'context.json') {
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
            const rdfsClass = {
              '@id': `${modelPrefix}:${modelDerivedFromName}`,
              '@type': 'rdfs:Class',
              'rdfs:label': {
                en: modelDerivedFromName,
              },
              'rdfs:comment': {
                en: '',
              },
            };
            if (typeof model.subClassOf !== 'undefined') {
              const subClassNamespace = derivePrefix(model.subClassOf) || consts.OPEN_ACTIVE_PREFIX;
              const subClassName = model.subClassOf.replace(/^#/, '').replace(namespaces[subClassNamespace], '');
              rdfsClass['rdfs:subClassOf'] = `${subClassNamespace}:${subClassName}`;
            }
            propsAndClasses.rdfs_classes.push(rdfsClass);
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
                const property = {
                  '@id': `${fieldPrefix}:${fieldSameAsName}`,
                  '@type': 'rdf:Property',
                  'rdfs:label': {
                    en: fieldSameAsName,
                  },
                  'rdfs:comment': {
                    en: typeof field.description === 'string' ? field.description : field.description.join(' '),
                  },
                  'rdfs:domain': '#',
                };
                const types = deriveSingularTypes(field);
                if (types.length === 1 && types[0].match(/^[A-Za-z]+$/)) {
                  property['rdfs:range'] = `oa:${types[0]}`;
                }
                propsAndClasses.rdfs_properties.push(property);
              }
            }
          }
        }
      }
    }
  }
  return Object.assign(
    graph,
    metaData,
    propsAndClasses,
  );
};

module.exports = getGraph;
