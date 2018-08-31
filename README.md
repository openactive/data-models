# OpenActive Data Models

Data models used to drive the OpenActive validator and developer documentation.

[![Build Status](https://travis-ci.org/openactive/data-models.svg?branch=master)](https://travis-ci.org/openactive/data-models)
[![Known Vulnerabilities](https://snyk.io/test/github/openactive/data-models/badge.svg)](https://snyk.io/test/github/openactive/data-models)

## Introduction

This library provides all the JSON representations of the models in the `src/<version>/models` directory. It is capable of storing multiple versions of the spec.

## API

The library provides various exports:

#### getFullyQualifiedProperty(name [, version [, contexts]])

Returns a resolved version of a property, indicating its namespace, prefix and alias. It will by default insert the OpenActive context for the provided specification version at the top of the context tree.

##### Example

```js

const { getFullyQualifiedProperty } = require('openactive-data-models');

let info = getFullyQualifiedProperty('type');

// {
//   "prefix": null,
//   "namespace": null,
//   "label": "@type",
//   "alias": "type",
// }

let info = getFullyQualifiedProperty('meetingPoint', '2.0');

// {
//   "prefix": "oa",
//   "namespace": "https://openactive.io/",
//   "label": "meetingPoint",
//   "alias": "meetingPoint",
// }

let info = getFullyQualifiedProperty('schema:name', '2.0');

// {
//   "prefix": "schema",
//   "namespace": "https://schema.org/",
//   "label": "name",
//   "alias": null,
// }

let info = getFullyQualifiedProperty('beta:field', '2.0');

// {
//   "prefix": null,
//   "namespace": null,
//   "label": "beta:field",
//   "alias": null,
// }

```

#### getMetaData([version])

Returns the meta data relating to the specification version supplied.

The meta data should contain the following keys:

* **defaultPrefix** - The default prefix that is used in the `@vocab` field of the OpenActive JSON-LD definition.
* **openActivePrefix** - The prefix used for OpenActive fields
* **contextUrl** - The URL that the JSON context of this specification is published at
* **specUrl** - The URL that the human-readable version of this specification is published at
* **defaultActivityLists** - An array of activity list URLs that accompany this spec
* **baseGraph** - A base object used when generating the `@graph` property of the OpenActive JSON-LD definition.
* **keywords** - A map of aliases for JSON-LD keywords.
* **namespaces** - A map of prefixes to namespaces used in the OpenActive JSON-LD definition.

##### Example

```js

const { getMetaData } = require('openactive-data-models');

const metaData = getMetaData('2.0');

// {
//   "defaultPrefix": "schema",
//   "openActivePrefix": "oa",
//   "contextUrl": "https://openactive.io/",
//   "specUrl": "https://www.openactive.io/modelling-opportunity-data/EditorsDraft/",
//   "defaultActivityLists": [
//     "https://openactive.io/activity-list"
//   ],
//   "baseGraph": {},
//   "keywords": {
//     "type": "@type",
//     "id": "@id"
//   },
//   "namespaces": {
//     "oa": "https://openactive.io/",
//     "dc": "http://purl.org/dc/terms/",
//     "owl": "http://www.w3.org/2002/07/owl#",
//     "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
//     "rdfa": "http://www.w3.org/ns/rdfa#",
//     "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
//     "schema": "https://schema.org/",
//     "skos": "http://www.w3.org/2004/02/skos/core#",
//     "xsd": "http://www.w3.org/2001/XMLSchema#",
//     "pending": "https://pending.schema.org/"
//   }
// }
```

#### loadModel(modelName [, version])

Returns the model definition for a particular version of the spec.

##### Example

```js

const { loadModel } = require('openactive-data-models');

// Returns the latest version of this model
const eventModel = loadModel('Event');

// Returns the 2.0 version of this model
const eventModel2 = loadModel('Event', '2.0');

```

#### versions

A hash of available versions. This includes some named aliases. You can pass the keys of this hash to any of the above methods in the `version` parameter.

##### Example

```js

const { versions } = require('openactive-data-models');

// {
//   "latest": "2.0",
//   "2.0": "2.0"
// }

```


## Development

### Getting started

```shell
$ git clone git@github.com:openactive/data-models.git
$ cd data-models
$ npm install
```
### Running tests

This project uses [Jasmine](https://jasmine.github.io/) for its tests. All spec files are located alongside the files that they target.

To run tests locally, run:

```shell
$ npm test
```

The test run will also include a run of [eslint](https://eslint.org/). To run the tests without these, use:

```shell
$ npm run test-no-lint
```

### Adding models

Add new models to the `src/models` directory.

Find more on the models, see the [model reference](MODELS.md)
