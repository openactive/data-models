const contexts = require('./dist/contexts');
const versions = require('./versions');

const getContext = (version) => {
  let localVersion = version;
  if (typeof localVersion === 'undefined') {
    localVersion = 'latest';
  }
  if (
    typeof versions[localVersion] === 'undefined'
    || typeof contexts[version] === 'undefined'
  ) {
    throw Error('Invalid specification version supplied');
  }
  return contexts[version];
};

module.exports = getContext;
