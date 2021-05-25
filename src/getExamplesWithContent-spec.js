const getExamplesWithContent = require('./getExamplesWithContent');

describe('getExamplesWithContent', () => {
  it('should throw if passed an invalid spec version', () => {
    const modelLoadTest = () => getExamplesWithContent('0.0');
    expect(modelLoadTest).toThrow();
  });

  it('should return valid examples as JSON', () => {
    const examples = getExamplesWithContent('2.0');
    expect(typeof examples).toBe('object');
    expect(examples instanceof Array).toBe(true);
  });

  it('should return valid examples as JSON with a version alias', () => {
    const examples = getExamplesWithContent('latest');
    expect(typeof examples).toBe('object');
    expect(examples instanceof Array).toBe(true);
  });
});
