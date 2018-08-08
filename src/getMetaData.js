const fs = require('fs');
const path = require('path');
const versions = require('./versions');

const getMetaData = (version) => {
  let localVersion = version;
  if (typeof localVersion === 'undefined') {
    localVersion = 'latest';
  }
  if (typeof versions[localVersion] === 'undefined') {
    throw Error('Invalid specification version supplied');
  }
  const jsonPath = path.join(__dirname, versions[localVersion], 'meta.json');
  const metaData = fs.readFileSync(jsonPath, 'utf8');
  return JSON.parse(metaData);
};

module.exports = getMetaData;
