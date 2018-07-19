const loadModel = require('./loadModel');

describe('loadModel', () => {
  it('should throw if passed an invalid model name', () => {
    const modelLoadTest = () => loadModel('../InvalidModel');
    expect(modelLoadTest).toThrow();
  });

  it('should throw if passed a model that doesn\'t exist', () => {
    const modelLoadTest = () => loadModel('InvalidModel');
    expect(modelLoadTest).toThrow();
  });

  it('should return a valid model as JSON', () => {
    const modelData = loadModel('Event');
    expect(typeof modelData).toBe('object');
    expect(modelData.type).toBe('Event');
  });
});
