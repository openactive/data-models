const loadModel = require('./loadModel');
const specs = require('./dist/specs');

const loadModelFromDist = (name, version) => loadModel(
  name,
  version,
  (localName, localVersion) => {
    let jsonKey = 'models';
    if (localName === 'FeedItem' || localName === 'FeedPage') {
      jsonKey = 'rpde';
    }
    if (
      typeof specs[localVersion] === 'undefined'
      || typeof specs[localVersion][jsonKey] === 'undefined'
      || typeof specs[localVersion][jsonKey][localName] === 'undefined'
    ) {
      throw Error('Invalid model name supplied');
    }
    return specs[localVersion][jsonKey][localName];
  },
  loadModelFromDist,
);

module.exports = loadModelFromDist;
