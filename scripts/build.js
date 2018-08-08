const fs = require('fs');
const path = require('path');

const generateContext = require('./generateContext');
const versions = require('../src/versions');

const uniqueVersions = [...new Set(Object.values(versions))];
const distPath = path.join(__dirname, '..', 'src', 'dist');

const specs = {};
const contexts = {};

for (const version of uniqueVersions) {
  const specPath = path.join(__dirname, '..', 'src', version);
  const spec = {
    models: {},
    rpde: {},
    meta: null,
  };

  const metaPath = path.join(specPath, 'meta.json');
  spec.meta = JSON.parse(
    fs.readFileSync(metaPath, 'utf8')
  );

  for (const folder of ['models', 'rpde']) {
    const files = fs.readdirSync(path.join(specPath, folder));
    for (const file of files) {
      const filePath = path.join(specPath, folder, file);
      const data = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(data);
      spec[folder][jsonData.type] = jsonData;
    }
  }

  specs[version] = spec;
  contexts[version] = generateContext(version);
}

fs.writeFileSync(
  path.join(distPath, 'contexts.js'),
  `/* eslint-disable */
// This is a generated file. Do not edit manually.
module.exports = ${JSON.stringify(contexts)};`,
  () => {},
);

fs.writeFileSync(
  path.join(distPath, 'specs.js'),
  `/* eslint-disable */
// This is a generated file. Do not edit manually.
module.exports = ${JSON.stringify(specs)};`,
  () => {},
);
