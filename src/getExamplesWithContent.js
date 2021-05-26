const fs = require('fs/promises');
const getExamples = require('./getExamples');

const EXAMPLES_DIRECTORY = `${__dirname}/../versions/2.x/examples/`;

const getExamplesWithContent = async (version) => {
  const examples = getExamples(version);
  const output = [];
  for (const { file, name } of examples.flatMap(x => x.exampleList)) {
    // Only include local examples
    if (file.indexOf('http') !== 0) {
      const data = await fs.readFile(`${EXAMPLES_DIRECTORY}${file}`, { encoding: 'utf8' });
      output.push({
        name,
        file,
        data,
        // data: JSON.parse(fs.readFileSync(`${EXAMPLES_DIRECTORY}${file}`, { encoding: 'utf8' })),
      });
    }
  }
  return output;
};

module.exports = getExamplesWithContent;
