const fs = require('fs');
const path = require('path');
const loadModel = require('./loadModel');
const versions = require('./versions');

const loadModelFromFile = (name, version) => loadModel(
  name,
  version,
  (localName, localVersion) => {
    let jsonPath;
    if (localName === 'FeedItem' || name === 'FeedPage') {
      jsonPath = path.join(__dirname, versions[localVersion], 'rpde', `${localName}.json`);
    } else {
      jsonPath = path.join(__dirname, versions[localVersion], 'models', `${localName}.json`);
    }
    const data = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(data);
  },
  loadModelFromFile,
);

module.exports = loadModelFromFile;
