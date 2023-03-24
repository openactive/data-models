const fs = require('fs');
const getExamples = require('./getExamples');

const EXAMPLES_DIRECTORY = `${__dirname}/../versions/2.x/examples/`;
const EXAMPLES_BASE_URL = 'https://openactive.io/data-models/versions/2.x/examples/';


const getExamplesWithContent = (version, fetcherForRemoteExamplesSync) => {
  const examples = getExamples(version);
  const flattenedExamples = examples.flatMap(x => x.exampleList.map(example => ({ category: x.name, ...example })));
  const output = [];
  for (const example of flattenedExamples) {
    if (example.file.indexOf('http') !== 0) {
      // Local example file
      const data = JSON.parse(fs.readFileSync(`${EXAMPLES_DIRECTORY}${example.file}`, { encoding: 'utf8' }));
      output.push({
        data,
        url: `${EXAMPLES_BASE_URL}${example.file}`,
        ...example,
      });
    } else if (fetcherForRemoteExamplesSync) {
      // Remote example file
      const data = fetcherForRemoteExamplesSync(`${example.file}`);
      output.push({
        data,
        url: example.file,
        ...example,
      });
    }
  }
  return output;
};

module.exports = getExamplesWithContent;
