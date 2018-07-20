const fs = require('fs');
const path = require('path');

describe('models', () => {
  const files = fs.readdirSync(path.join(__dirname, 'models'));
  for (const file of files) {
    it(`file ${file} should be valid json`, () => {
      const filePath = path.join(__dirname, 'models', file);
      const data = fs.readFileSync(filePath, 'utf8');
      let jsonData;
      const readJson = () => { jsonData = JSON.parse(data); };
      expect(readJson).not.toThrow();
      expect(typeof jsonData).toEqual('object');
    });
  }
});
