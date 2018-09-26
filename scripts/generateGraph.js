// TODO:
// - rdfs:domain
// - rdfs:subPropertyOf
// - comments
// - GenderRestrictionTypes

const fs = require('fs');
const path = require('path');

const getMetaData = require('../src/getMetaData');
const derivePrefix = require('../src/helpers/derivePrefix');
const deriveSingularTypes = require('../src/helpers/deriveSingularTypes');
const deriveVersion = require('../src/helpers/deriveVersion');

const generateGraph = (version, metaData, enums) => {
  const specVersion = deriveVersion(version);
  const extraData = {
    '@id': metaData.namespaces[metaData.openActivePrefix],
    'dc:date': (new Date()).toISOString().replace(/T.*$/, ''),
    'owl:versionInfo': '#',
  };
  const propsAndClasses = {
    rdfs_classes: [],
    rdfs_properties: [],
  };

  const oaEnums = [];
  for (const enumKey in enums) {
    if (Object.prototype.hasOwnProperty.call(enums, enumKey)) {
      const enumObj = enums[enumKey];
      if (enumObj.namespace === metaData.contextUrl) {
        oaEnums.push(`${metaData.contextUrl}${enumKey}`);
        propsAndClasses.rdfs_classes.push({
          '@id': `${metaData.openActivePrefix}:${enumKey}`,
          '@type': 'rdfs:Class',
          'rdfs:label': {
            en: enumKey,
          },
          'rdfs:comment': {
            en: enumObj.comment || '',
          },
        });
        for (const enumValue of enumObj.values) {
          propsAndClasses.rdfs_classes.push({
            '@id': `${metaData.openActivePrefix}:${enumValue}`,
            '@type': 'rdfs:Class',
            'rdfs:label': {
              en: enumValue,
            },
            'rdfs:comment': {
              en: `Enumerated value of ${enumKey}`,
            },
            'rdfs:subClassOf': `${metaData.openActivePrefix}:${enumKey}`,
          });
        }
      }
    }
  }

  const files = fs.readdirSync(path.join(__dirname, '..', 'versions', specVersion, 'models'));
  for (const file of files) {
    if (file !== 'model_list.json') {
      const jsonPath = path.join(__dirname, '..', 'versions', specVersion, 'models', file);
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
                if (types.length === 1) {
                  if (types[0].match(/^[A-Za-z]+$/)) {
                    property['rdfs:range'] = `${metaData.openActivePrefix}:${types[0]}`;
                  } else if (oaEnums.indexOf(types[0]) >= 0) {
                    property['rdfs:range'] = `${metaData.openActivePrefix}:${types[0].replace(metaData.contextUrl, '')}`;
                  }
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
    {},
    metaData.baseGraph,
    extraData,
    propsAndClasses,
  );
};

module.exports = generateGraph;
