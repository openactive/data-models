const getContext = require('./getContext');

describe('getContext', () => {
  it('should throw if passed an invalid spec version', () => {
    const contextLoadTest = () => getContext('0.0');
    expect(contextLoadTest).toThrow();
  });

  it('should return valid metaData as JSON', () => {
    const context = getContext('2.0');
    expect(typeof context).toBe('object');
    expect(context['@vocab']).toBe('https://schema.org/');
  });

  it('should return valid metaData as JSON with a version alias', () => {
    const context = getContext('latest');
    expect(typeof context).toBe('object');
    expect(context['@vocab']).toBe('https://schema.org/');
  });
});
