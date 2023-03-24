const getExamplesWithContent = require('./getExamplesWithContent');

describe('getExamplesWithContent', () => {
  it('should throw if passed an invalid spec version', async () => {
    expect(getExamplesWithContent('0.0')).toThrow();
  });

  it('should return valid examples as JSON', async () => {
    const examples = getExamplesWithContent('2.0');
    expect(typeof examples).toBe('object');
    expect(examples instanceof Array).toBe(true);
  });

  it('should return valid examples as JSON with a version alias', async () => {
    const examples = getExamplesWithContent('latest');
    expect(typeof examples).toBe('object');
    expect(examples instanceof Array).toBe(true);
  });

  it('should use remote fetcher for remote examples', async () => {
    const mockFetcher = x => `Fetcher:${x}`;

    const examples = getExamplesWithContent('latest', mockFetcher);
    expect(typeof examples).toBe('object');
    expect(examples instanceof Array).toBe(true);

    const remoteExamples = examples.filter(x => x.file.indexOf('http') === 0);
    expect(remoteExamples).toBeNonEmptyArray();

    for (const { file, data } of remoteExamples) {
      expect(data).toBe(mockFetcher(file));
    }
  });
});
