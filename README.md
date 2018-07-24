# Open Active Data Models

Data models used to drive the OpenActive validator and developer documentation.

[![Build Status](https://travis-ci.org/openactive/data-models.svg?branch=master)](https://travis-ci.org/openactive/data-models)
[![Known Vulnerabilities](https://snyk.io/test/github/openactive/data-models/badge.svg)](https://snyk.io/test/github/openactive/data-models)

## Introduction

This library provides all the JSON representations of the models in the `src/models` directory.

It also provides a convenience load method, `loadModel` 

### Example

```js

const models = require('openactive-data-models');

const eventModel = models.loadModel('Event');

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

This project uses [Jasmine 1.3](https://jasmine.github.io/) for its tests via [jasmine-node](https://github.com/mhevery/jasmine-node). All spec files are located alongside the files that they target.

To run tests, run:

```shell
$ npm test
```

### Adding models

Add new models to the `src/models` directory.

Find more on the models, see the [model reference](MODELS.md)
