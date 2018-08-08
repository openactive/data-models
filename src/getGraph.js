// TODO:
// - rdfs:domain
// - rdfs:subPropertyOf
// - comments
// - GenderRestrictionTypes

const fs = require('fs');
const path = require('path');

const getMetaData = require('./getMetaData');
const derivePrefix = require('./helpers/derivePrefix');
const deriveSingularTypes = require('./helpers/deriveSingularTypes');
const versions = require('./versions');

const getGraph = (version) => {
  let localVersion = version;
  if (typeof localVersion === 'undefined') {
    localVersion = 'latest';
  }
  if (typeof versions[localVersion] === 'undefined') {
    throw Error('Invalid specification version supplied');
  }

  const specVersion = versions[localVersion];

  const metaData = getMetaData(specVersion);
  const extraData = {
    '@id': metaData.namespaces[metaData.openActivePrefix],
    'dc:date': (new Date()).toISOString().replace(/T.*$/, ''),
    'owl:versionInfo': '#',
  };
  const propsAndClasses = {
    rdfs_classes: [],
    rdfs_properties: [],
  };
  const files = fs.readdirSync(path.join(__dirname, specVersion, 'models'));
  for (const file of files) {
    if (file !== 'model_list.json') {
      const jsonPath = path.join(__dirname, specVersion, 'models', file);
      const data = fs.readFileSync(jsonPath, 'utf8');
      const model = JSON.parse(data);

      if (file !== 'context.json') {
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
              const subClassNamespace = derivePrefix(model.subClassOf, metaData.namespaces) || metaData.openActivePrefix;
              const subClassName = model.subClassOf.replace(/^#/, '').replace(metaData.namespaces[subClassNamespace], '');
              rdfsClass['rdfs:subClassOf'] = `${subClassNamespace}:${subClassName}`;
            }
            propsAndClasses.rdfs_classes.push(rdfsClass);
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
    metaData.graph,
    extraData,
    propsAndClasses,
  );
};

module.exports = getGraph;
