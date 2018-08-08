const specs = require('./dist/specs');
const versions = require('./versions');

const getMetaData = (version) => {
  let localVersion = version;
  if (typeof localVersion === 'undefined') {
    localVersion = 'latest';
  }
  if (
    typeof versions[localVersion] === 'undefined'
    || typeof specs[version] === 'undefined'
    || typeof specs[version].meta === 'undefined'
  ) {
    throw Error('Invalid specification version supplied');
  }
  return specs[version].meta;
};

module.exports = getMetaData;
