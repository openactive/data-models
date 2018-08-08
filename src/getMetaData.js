const specs = require('./dist/specs');
const versions = require('./versions');

const getMetaData = (version) => {
  let localVersion = version;
  if (typeof localVersion === 'undefined') {
    localVersion = 'latest';
  }
  if (
    typeof versions[localVersion] === 'undefined'
    || typeof specs[versions[localVersion]] === 'undefined'
    || typeof specs[versions[localVersion]].meta === 'undefined'
  ) {
    throw Error('Invalid specification version supplied');
  }
  return specs[versions[localVersion]].meta;
};

module.exports = getMetaData;
