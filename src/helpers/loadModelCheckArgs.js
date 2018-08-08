const versions = require('../versions');

const loadModelCheckArgs = (name, version) => {
  if (!name.match(/^[A-Za-z]+$/) || name === 'model_list') {
    throw Error('Invalid model name supplied');
  }
  let localVersion = version;
  if (typeof localVersion === 'undefined') {
    localVersion = 'latest';
  }
  if (typeof versions[localVersion] === 'undefined') {
    throw Error('Invalid specification version supplied');
  }
  return versions[localVersion];
};

module.exports = loadModelCheckArgs;
