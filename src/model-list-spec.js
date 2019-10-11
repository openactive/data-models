const fs = require('fs');
const path = require('path');

const versions = require('./versions');

describe('model-list', () => {
  const uniqueVersions = [...new Set(Object.values(versions))];
  for (const version of uniqueVersions) {
    const file = 'model_list.json';
    const modelListFilepath = path.join(__dirname, '..', 'versions', version, 'models', file);
    const data = fs.readFileSync(modelListFilepath, 'utf8');
    describe(`file ${file}`, () => {
      let jsonData;
      const readJson = () => { jsonData = JSON.parse(data); };

      it('should be valid json', () => {
        expect(readJson).not.toThrow();
        expect(typeof jsonData).toEqual('object');
      });

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
    });
  }
});
