const fs = require('fs');
const path = require('path');

const getMetaData = require('./getMetaData');
const derivePrefix = require('./helpers/derivePrefix');

const loadModelFromFile = require('./loadModelFromFile');
const versions = require('./versions');

describe('models', () => {
  const existing = {};
  const uniqueVersions = [...new Set(Object.values(versions))];
  for (const version of uniqueVersions) {
    const files = [
      ...fs.readdirSync(path.join(__dirname, '..', 'versions', version, 'models')),
      ...fs.readdirSync(path.join(__dirname, '..', 'versions', version, 'rpde')),
    ];
    const metaData = getMetaData(version);
    for (const file of files) {
      describe(`file ${file}`, () => {
        let dir = 'models';
        if (file.match(/^Feed/)) {
          dir = 'rpde';
        }
        const filePath = path.join(__dirname, '..', 'versions', version, dir, file);
        const data = fs.readFileSync(filePath, 'utf8');
        let jsonData;
        const readJson = () => { jsonData = JSON.parse(data); };

        it('should be valid json', () => {
          expect(readJson).not.toThrow();
          expect(typeof jsonData).toEqual('object');
        });

        // Now we have the object, we can check the format of some properties
        if (file === 'model_list.json') {
          // Do one set of checks
          describe('data', () => {
            beforeEach(() => {
              jsonData = JSON.parse(data);
            });
            it('should have event_elements set', () => {
              expect(jsonData.event_elements).toBeDefined();
              expect(jsonData.event_elements instanceof Array).toBe(true);
            });
            it('should have event_booking set', () => {
              expect(jsonData.event_booking).toBeDefined();
              expect(jsonData.event_booking instanceof Array).toBe(true);
            });
            it('should have event_core set', () => {
              expect(jsonData.event_core).toBeDefined();
              expect(jsonData.event_core instanceof Array).toBe(true);
            });
            it('should have models set', () => {
              expect(jsonData.models).toBeDefined();
              expect(typeof jsonData.models).toBe('object');
            });
            it('should have models with names that match their keys', () => {
              for (const model in jsonData.models) {
                if (Object.prototype.hasOwnProperty.call(jsonData.models, model)) {
                  expect(jsonData.models[model].modelName).toBeDefined();
                  expect(jsonData.models[model].modelName.toLowerCase()).toBe(model.toLowerCase());
                }
              }
            });
          });
        } else {
          describe('data', () => {
            beforeAll(() => {
              jsonData = loadModelFromFile(file.replace(/\.json$/, ''), version);
            });

            it('should have a type that matches the file name', () => {
              expect(jsonData.type).toBeDefined();
              expect(`${jsonData.type.toLowerCase()}.json`).toEqual(file.toLowerCase());
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
              for (const field in jsonData.fields) {
                if (Object.prototype.hasOwnProperty.call(jsonData.fields, field)) {
                  expect(jsonData.inSpec).toContain(field);
                }
              }
            });

            it('should have fields with names that match their keys', () => {
              for (const field in jsonData.fields) {
                if (Object.prototype.hasOwnProperty.call(jsonData.fields, field)) {
                  expect(jsonData.fields[field].fieldName).toBeDefined();
                  expect(jsonData.fields[field].fieldName).toBe(field);
                }
              }
            });

            it('should have fields with either a requiredType or model', () => {
              for (const field in jsonData.fields) {
                if (Object.prototype.hasOwnProperty.call(jsonData.fields, field)) {
                  expect(
                    typeof jsonData.fields[field].model === 'undefined'
                    || typeof jsonData.fields[field].requiredType === 'undefined',
                  ).toBe(true);
                }
              }
            });

            it('should have fields with a model property that points to real models', () => {
              for (const field in jsonData.fields) {
                if (Object.prototype.hasOwnProperty.call(jsonData.fields, field)) {
                  if (typeof jsonData.fields[field].model !== 'undefined') {
                    expect(jsonData.fields[field].model).toMatch(/^(ArrayOf)?#[A-Za-z]+$/);
                  }
                }
              }
            });

            it('should have fields with an additionalModels property that are arrays pointing to real models', () => {
              for (const field in jsonData.fields) {
                if (Object.prototype.hasOwnProperty.call(jsonData.fields, field)) {
                  if (typeof jsonData.fields[field].additionalModels !== 'undefined') {
                    expect(jsonData.fields[field].additionalModels instanceof Array).toBe(true);
                    for (const model of jsonData.fields[field].additionalModels) {
                      expect(model).toMatch(/^(ArrayOf)?#[A-Za-z]+$/);
                    }
                  }
                }
              }
            });

            it('should have fields with a type property that points to real types', () => {
              for (const field in jsonData.fields) {
                if (Object.prototype.hasOwnProperty.call(jsonData.fields, field)) {
                  if (typeof jsonData.fields[field].requiredType !== 'undefined') {
                    expect(jsonData.fields[field].requiredType).toMatch(/^(ArrayOf#)?(https:\/\/schema\.org\/|https:\/\/openactive\.io\/|http:\/\/purl\.org\/goodrelations\/v1#)[a-zA-Z]+$/);
                  }
                }
              }
            });

            it('should have fields with an additionalTypes property that are arrays pointing to real models', () => {
              for (const field in jsonData.fields) {
                if (Object.prototype.hasOwnProperty.call(jsonData.fields, field)) {
                  if (typeof jsonData.fields[field].additionalTypes !== 'undefined') {
                    expect(jsonData.fields[field].additionalTypes instanceof Array).toBe(true);
                    for (const type of jsonData.fields[field].additionalTypes) {
                      expect(type).toMatch(/^(ArrayOf#)?http:\/\/(schema\.org|openactive\.io)\/[a-zA-Z]+$/);
                    }
                  }
                }
              }
            });

            it('should have fields with a description property that is an array of strings, unless it is a type', () => {
              for (const field in jsonData.fields) {
                if (Object.prototype.hasOwnProperty.call(jsonData.fields, field)) {
                  if (typeof jsonData.fields[field].description !== 'undefined') {
                    expect(jsonData.fields[field].description instanceof Array
                      && jsonData.fields[field].description.filter(item => typeof item !== 'string').length === 0).toBe(true, field);
                  } else if (field !== 'type') {
                    fail(`Does not have description, '${field}'.`);
                  }
                }
              }
            });

            it('should have "type" with only exactly the properties fieldName, requiredType, requiredContent; and with requiredType as "https://schema.org/Text".', () => {
              if (jsonData.type !== 'FeedPage' && jsonData.type !== 'FeedItem') {
                expect(jsonData.fields.type && Object.keys(jsonData.fields.type).length).toBe(3, 'number of properties within type');
                expect(jsonData.fields.type.fieldName).toBe('type');
                expect(jsonData.fields.type.requiredType).toBe('https://schema.org/Text');
                expect(jsonData.fields.type.requiredContent).toMatch(/^[a-zA-Z]+$/);
              }
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
                  expect(
                    typeof existing[fieldName] === 'undefined'
                    || existing[fieldName] === `${fieldPrefix}:${fieldSameAsName}`,
                  ).toBe(true);
                  existing[fieldName] = `${fieldPrefix}:${fieldSameAsName}`;
                }
              }
            });
          });
        }
      });
    }
  }
});
