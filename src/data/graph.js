module.exports = {
  '@context': {
    id: '@id',
    type: '@type',
    'dc:title': {
      '@container': '@language',
    },
    'dc:description': {
      '@container': '@language',
    },
    'dc:date': {
      '@type': 'xsd:date',
    },
    'rdfs:comment': {
      '@container': '@language',
    },
    'rdfs:domain': {
      '@type': '@id',
    },
    'rdfs:label': {
      '@container': '@language',
    },
    'rdfs:range': {
      '@type': '@id',
    },
    'rdfs:seeAlso': {
      '@type': '@id',
    },
    'rdfs:subClassOf': {
      '@type': '@id',
    },
    'rdfs:subPropertyOf': {
      '@type': '@id',
    },
    'owl:equivalentClass': {
      '@type': '@vocab',
    },
    'owl:equivalentProperty': {
      '@type': '@vocab',
    },
    'owl:oneOf': {
      '@container': '@list',
      '@type': '@vocab',
    },
    'owl:imports': {
      '@type': '@id',
    },
    'owl:versionInfo': {
      '@type': '@id',
    },
    'owl:inverseOf': {
      '@type': '@vocab',
    },
    'owl:unionOf': {
      '@type': '@vocab',
      '@container': '@list',
    },
    rdfs_classes: {
      '@reverse': 'rdfs:isDefinedBy',
      '@type': '@id',
    },
    rdfs_properties: {
      '@reverse': 'rdfs:isDefinedBy',
      '@type': '@id',
    },
    rdfs_datatypes: {
      '@reverse': 'rdfs:isDefinedBy',
      '@type': '@id',
    },
    rdfs_instances: {
      '@reverse': 'rdfs:isDefinedBy',
      '@type': '@id',
    },
    concepts: {
      '@reverse': 'skos:inScheme',
    },
  },
  '@id': '',
  '@type': 'owl:Ontology',
  'dc:title': {
    en: 'OpenActive Namespace Vocabulary Terms',
  },
  'dc:description': {
    en: 'This document describes the vocabulary used in the Modelling Opportunity Data specification.',
  },
  'dc:date': '',
  'owl:versionInfo': '',
  rdfs_classes: [],
  rdfs_properties: [],
};
