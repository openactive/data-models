const jsonld = require('jsonld');

const getPropertiesFromVocab = async (vocab) => {
  // Use framing to grab all the properties from the vocab
  // https://www.w3.org/TR/json-ld-framing/
  const framedOutput = await jsonld.frame(vocab, {
    '@context': {
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    },
    '@type': 'rdf:Property',
    '@explicit': true,
  });
  return framedOutput['@graph'].map((x) => x['@id']);
};

const generatePropertyList = async (graphs) => (await Promise.all(graphs.map(getPropertiesFromVocab))).flat();

module.exports = generatePropertyList;
