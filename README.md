# Open Active Data Models

Data models used to drive the OpenActive validator and developer documentation.

[![Build Status](https://travis-ci.org/openactive/data-models.svg?branch=master)](https://travis-ci.org/openactive/data-models)
[![Known Vulnerabilities](https://snyk.io/test/github/openactive/data-models/badge.svg)](https://snyk.io/test/github/openactive/data-models)

## Introduction

This library provides all the JSON representations of the models in the `src/models` directory.

It also provides a convenience load method, `loadModel` 

### Example

```js

const { loadModel } = require('openactive-data-models');

const eventModel = loadModel('Event');

// Do things with the eventModel...

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
