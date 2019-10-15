const fs = require('fs');
const path = require('path');
const request = require('sync-request');

const getEnums = require('./getEnums');
const getMetaData = require('./getMetaData');
const derivePrefix = require('./helpers/derivePrefix');

const loadModelFromFile = require('./loadModelFromFile');
const versions = require('./versions');

const schemaOrgDataModels = (() => {
  const fetchIds = (url) => {
    const response = request('GET', url, {
      accept: 'application/ld+json',
    });
    return JSON.parse(response.body)['@graph'].map(model => model['@id']);
  };

  const schemaSources = [
    'https://schema.org/version/latest/schema.jsonld',
    'https://schema.org/version/3.9/ext-meta.jsonld',
    'https://schema.org/version/latest/ext-pending.jsonld',
  ];

  return schemaSources.reduce((store, url) => store.concat(fetchIds(url)), []);
})();

const forEachVersion = (cb) => {
  const uniqueVersions = [...new Set(Object.values(versions))];
  for (const version of uniqueVersions) {
    const modelsDirpath = path.join(__dirname, '..', 'versions', version, 'models');
    const rpdeDirpath = path.join(__dirname, '..', 'versions', version, 'rpde');
    const files = [
      ...fs.readdirSync(modelsDirpath),
      ...fs.readdirSync(rpdeDirpath),
    ];
    const metaData = getMetaData(version);
    cb(version, metaData, modelsDirpath, rpdeDirpath, files);
  }
};

const forEachVersionedFile = (cb) => {
  forEachVersion((version, metaData, modelsDirpath, rpdeDirpath, files) => {
    for (const file of files) {
      if (file !== 'model_list.json') {
        const dir = file.match(/^Feed/) ? rpdeDirpath : modelsDirpath;
        const filePath = path.join(dir, file);
        const data = fs.readFileSync(filePath, 'utf8');
        cb(version, metaData, modelsDirpath, rpdeDirpath, file, data);
      }
    }
  });
};

const forEachField = (model, cb) => {
  for (const field in model.fields) {
    if (Object.prototype.hasOwnProperty.call(model.fields, field)) {
      const fieldSpec = model.fields[field];
      cb(field, fieldSpec);
    }
  }
};

describe('models', () => {
  forEachVersionedFile((version, metaData, modelsDirpath, rpdeDirpath, file, data) => {
    const fieldNameToNamespaced = {};

    const modelExists = (modelName) => {
      const modelFilename = `${modelName}.json`;
      const modelExpectedFilepath = path.join(modelsDirpath, modelFilename);
      return fs.existsSync(modelExpectedFilepath);
    };

    const customMatchers = {
      toBeValidModelReference() {
        return {
          compare(modelRef) {
            const result = {};
            const modelName = modelRef.replace(/^(ArrayOf)?#/, '');

            result.pass = modelExists(modelName);
            if (!result.pass) {
              result.message = `${modelRef} is not a valid model reference`;
            }
            return result;
          },
        };
      },

      toBeValidClassReference() {
        return {
          compare(classRef) {
            const result = {};
            const classId = classRef.replace(/^ArrayOf#?/, '').replace(/^https:\/\/schema.org/, 'http://schema.org');
            if (classId.match(/^http:\/\/schema\.org/)) {
              result.pass = schemaOrgDataModels.includes(classId);
              if (!result.pass) {
                result.message = `${classRef} is not a valid schema.org reference`;
              }
            } else if (classId.match(/^https:\/\/openactive.io/)) {
              const enumName = classId.replace(/^https:\/\/openactive.io\//, '');
              const enums = getEnums(version);
              result.pass = Object.prototype.hasOwnProperty.call(enums, enumName);
              if (!result.pass) {
                result.message = `${classRef} is not a valid Open Active reference`;
              }
            } else {
              throw new Error(`unrecognished class ${classId}`);
            }

            return result;
          },
        };
      },
    };

    beforeEach(() => {
      jasmine.addMatchers(customMatchers);
    });

    describe(`file ${file}`, () => {
      let jsonData;

      it('should be valid json', () => {
        const readJson = () => { jsonData = JSON.parse(data); };
        expect(readJson).not.toThrow();
        expect(typeof jsonData).toEqual('object');
      });

      describe('data', () => {
        beforeAll(() => {
          jsonData = loadModelFromFile(file.replace(/\.json$/, ''), version);
        });

        it('should have a type that matches the file name', () => {
          expect(jsonData.type).toBeDefined();
          expect(`${jsonData.type.toLowerCase()}.json`).toEqual(file.toLowerCase());
        });

        it('should check sameAs on fields actually exist when they are properties from schema.org', () => {
          for (const field in jsonData.fields) {
            if (
              Object.prototype.hasOwnProperty.call(jsonData.fields, field)
                && typeof jsonData.fields[field].sameAs === 'string'
                && jsonData.fields[field].sameAs.match(/^https:\/\/schema.org/)
            ) {
              const propertyId = jsonData.fields[field].sameAs.replace(/^https/, 'http');
              expect(schemaOrgDataModels.includes(propertyId)).toBe(true);
            }
          }
        });

        it('should check fields actually exist as properties from schema.org when model is derivedFrom from a schema.org class', () => {
          if (typeof jsonData.derivedFrom === 'string' && jsonData.derivedFrom.match(/^https:\/\/schema.org/)) {
            for (const field in jsonData.fields) {
              if (
                Object.prototype.hasOwnProperty.call(jsonData.fields, field)
                  && typeof jsonData.fields[field].sameAs === 'undefined'
                  && field !== 'type'
              ) {
                const impliedPropertyId = `http://schema.org/${field}`;
                const actual = schemaOrgDataModels.includes(impliedPropertyId);
                expect(actual).toBe(true);
              }
            }
          }
        });

        it('should check that any schema.org class that a model derives from actually exists', () => {
          if (
            typeof jsonData.derivedFrom === 'string'
              && jsonData.derivedFrom.match(/^https:\/\/schema.org/)
          ) {
            const derivedFromClassId = jsonData.derivedFrom.replace(/^https/, 'http');
            expect(schemaOrgDataModels.includes(derivedFromClassId)).toBe(true);
          }
        });

        it('should have an idFormat and sampleId if hasId is true', () => {
          if (typeof jsonData.hasId !== 'undefined') {
            expect(typeof jsonData.hasId).toBe('boolean');

            if (jsonData.hasId === true) {
              expect(jsonData.idFormat).toBeDefined();
              expect(jsonData.sampleId).toBeDefined();
              expect(jsonData.requiredFields.concat(jsonData.recommendedFields)).toContain('id');
              expect(jsonData.inSpec).toContain('id');
            }
          }
        });

        it('should have a requiredFields property of type array if defined', () => {
          if (typeof jsonData.requiredFields !== 'undefined') {
            expect(jsonData.requiredFields instanceof Array).toBe(true);
          }
        });

        it('should have a recommendedFields property of type array if defined', () => {
          if (typeof jsonData.recommendedFields !== 'undefined') {
            expect(jsonData.recommendedFields instanceof Array).toBe(true);
          }
        });

        it('should not have fields in both requiredFields and recommendedFields', () => {
          if (typeof jsonData.recommendedFields !== 'undefined'
            && typeof jsonData.requiredFields !== 'undefined'
          ) {
            for (const field of jsonData.requiredFields) {
              expect(jsonData.recommendedFields).not.toContain(field);
            }
          }
        });

        it('should not have fields in both requiredFields and requiredOptions', () => {
          if (typeof jsonData.requiredOptions !== 'undefined'
            && typeof jsonData.requiredFields !== 'undefined'
          ) {
            for (const option of jsonData.requiredOptions) {
              for (const field of option.options) {
                expect(jsonData.requiredFields).not.toContain(field);
              }
            }
          }
        });

        it('should have a inSpec property of type array if defined', () => {
          if (typeof jsonData.inSpec !== 'undefined') {
            expect(jsonData.inSpec instanceof Array).toBe(true);
          }
        });

        it('should have a inSpec property that contains everything in requiredFields and recommendedFields', () => {
          if (typeof jsonData.requiredFields !== 'undefined') {
            for (const field of jsonData.requiredFields) {
              expect(jsonData.inSpec).toContain(field);
            }
          }
          if (typeof jsonData.recommendedFields !== 'undefined') {
            for (const field of jsonData.requiredFields) {
              expect(jsonData.inSpec).toContain(field);
            }
          }
          if (typeof jsonData.requiredOptions !== 'undefined') {
            for (const option of jsonData.requiredOptions) {
              for (const field of option.options) {
                expect(jsonData.inSpec).toContain(field);
              }
            }
          }
        });

        it('should have a fields property or a subClassOf property', () => {
          expect(typeof jsonData.fields).toBe('object');
        });

        it('should have fields for everything in inSpec', () => {
          for (const field of jsonData.inSpec) {
            if (field !== 'id') {
              expect(Object.keys(jsonData.fields)).toContain(field);
            }
          }
        });

        it('should have inSpec value for everything in fields', () => {
          forEachField(jsonData, (field) => {
            expect(jsonData.inSpec).toContain(field);
          });
        });

        it('should have fields with names that match their keys', () => {
          forEachField(jsonData, (field, fieldSpec) => {
            expect(fieldSpec.fieldName).toBeDefined();
            expect(fieldSpec.fieldName).toBe(field);
          });
        });

        it('should have fields with either a requiredType or model', () => {
          forEachField(jsonData, (field, fieldSpec) => {
            expect(
              typeof fieldSpec.model === 'undefined'
              || typeof fieldSpec.requiredType === 'undefined',
            ).toBe(true);
          });
        });

        it('should have fields with a model property that points to real models', () => {
          forEachField(jsonData, (field, fieldSpec) => {
            if (typeof fieldSpec.model !== 'undefined') {
              expect(fieldSpec.model).toMatch(/^(ArrayOf)?#[A-Za-z]+$/);
            }
          });
        });

        it('should have fields with an additionalModels property that are arrays pointing to real models', () => {
          forEachField(jsonData, (field, fieldSpec) => {
            if (typeof fieldSpec.additionalModels !== 'undefined') {
              expect(fieldSpec.additionalModels instanceof Array).toBe(true);
              for (const model of fieldSpec.additionalModels) {
                expect(model).toMatch(/^(ArrayOf)?#[A-Za-z]+$/);
              }
            }
          });
        });

        it('should have fields with a type property that points to real types', () => {
          forEachField(jsonData, (field, fieldSpec) => {
            if (typeof fieldSpec.requiredType !== 'undefined') {
              expect(fieldSpec.requiredType).toMatch(/^(ArrayOf#)?(https:\/\/schema\.org\/|https:\/\/openactive\.io\/|http:\/\/purl\.org\/goodrelations\/v1#)[a-zA-Z]+$/);
            }
          });
        });

        it('should have fields with an additionalTypes property that are arrays pointing to real models', () => {
          forEachField(jsonData, (field, fieldSpec) => {
            if (typeof fieldSpec.additionalTypes !== 'undefined') {
              expect(fieldSpec.additionalTypes instanceof Array).toBe(true);
              for (const type of fieldSpec.additionalTypes) {
                expect(type).toMatch(/^(ArrayOf#)?http:\/\/(schema\.org|openactive\.io)\/[a-zA-Z]+$/);
              }
            }
          });
        });

        it('should have fields with a description property that is an array of strings, unless it is a type', () => {
          forEachField(jsonData, (field, fieldSpec) => {
            if (typeof fieldSpec.description !== 'undefined') {
              expect(fieldSpec.description instanceof Array
                && fieldSpec.description.filter(item => typeof item !== 'string').length === 0).toBe(true, field);
            } else if (field !== 'type') {
              fail(`Does not have description, '${field}'.`);
            }
          });
        });

        it('should have "type" with only exactly the properties fieldName, requiredType, requiredContent; and with requiredType as "https://schema.org/Text".', () => {
          if (jsonData.type !== 'FeedPage' && jsonData.type !== 'FeedItem') {
            expect(jsonData.fields.type && Object.keys(jsonData.fields.type).length).toBe(3, 'number of properties within type');
            expect(jsonData.fields.type.fieldName).toBe('type');
            expect(jsonData.fields.type.requiredType).toBe('https://schema.org/Text');
            expect(jsonData.fields.type.requiredContent).toMatch(/^[a-zA-Z]+$/);
          }
        });

        it('should only use existing models for models property of a field spec', () => {
          forEachField(jsonData, (field, fieldSpec) => {
            if (
              typeof fieldSpec.model === 'string'
            ) {
              expect(fieldSpec.model).toBeValidModelReference();
            }
          });
        });

        describe('alternativeModels', () => {
          it('should only include entries defined in models json', () => {
            forEachField(jsonData, (field, fieldSpec) => {
              if (
                typeof fieldSpec.alternativeModels === 'object'
                && fieldSpec.alternativeModels.length > 0
              ) {
                fieldSpec.alternativeModels.forEach((alternativeModel) => {
                  expect(alternativeModel).toBeValidModelReference();
                });
              }
            });
          });
        });

        describe('notInSpec', () => {
          it('should only include fields present in the parentModel', () => {
            if (
              typeof jsonData.notInSpec === 'object'
              && jsonData.notInSpec.length > 0
            ) {
              const parentModelName = jsonData.subClassGraph[0].replace(/^#/, '');
              const parentModel = loadModelFromFile(parentModelName, version);
              jsonData.notInSpec.forEach((notInSpecField) => {
                expect(Object.hasOwnProperty.call(parentModel.fields, notInSpecField)).toBe(true);
              });
            }
          });
        });
      });

      describe('namespaces', () => {
        let model;
        beforeEach(() => {
          model = JSON.parse(data);
        });
        it('should not have fields in multiple namespaces', () => {
          if (typeof model.isJsonLd !== 'undefined' && model.isJsonLd === false) {
            return;
          }
          let modelPrefix = metaData.openActivePrefix;
          const hasModelDerivedFrom = typeof model.derivedFrom !== 'undefined' && model.derivedFrom !== null;
          if (hasModelDerivedFrom) {
            modelPrefix = derivePrefix(model.derivedFrom, metaData.namespaces) || modelPrefix;
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
              const fieldSameAsName = hasFieldSameAs
                ? field.sameAs.replace(metaData.namespaces[fieldPrefix], '')
                : fieldName;
              const fieldNameWithNamespace = `${fieldPrefix}:${fieldSameAsName}`;
              if (typeof fieldNameToNamespaced[fieldName] === 'undefined') {
                // if field with this name has not been seen before, then store to compare with other occurances
                fieldNameToNamespaced[fieldName] = fieldNameWithNamespace;
              } else {
                // if field with this name has been seen before, then make sure two occurances are from the same namespace
                expect(fieldNameToNamespaced[fieldName] === fieldNameWithNamespace).toBe(true);
              }
            }
          }
        });
      });
    });
  });
});
