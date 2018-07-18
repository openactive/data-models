'use strict';

const fs = require('fs');
const path = require('path');

const loadModel = function(name) {
    if (!name.match(/^[A-Za-z]+$/)) {
        throw "Invalid model name supplied";
    }
    let jsonPath = path.join(__dirname, 'models', name + '.json');
    let data = fs.readFileSync(jsonPath, 'utf8');
    let model = JSON.parse(data);
    return model;
}

module.exports = loadModel;
