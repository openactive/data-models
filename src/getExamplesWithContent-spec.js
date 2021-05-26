const getExamplesWithContent = require('./getExamplesWithContent');

describe('getExamplesWithContent', () => {
  it('should throw if passed an invalid spec version', async () => {
    expectAsync(getExamplesWithContent('0.0')).toBeRejected();
  });

  it('should return valid examples as JSON', async () => {
    const examples = await getExamplesWithContent('2.0');
    expect(typeof examples).toBe('object');
    expect(examples instanceof Array).toBe(true);
  });

  it('should return valid examples as JSON with a version alias', async () => {
    const examples = await getExamplesWithContent('latest');
    expect(typeof examples).toBe('object');
    expect(examples instanceof Array).toBe(true);
  });
});
