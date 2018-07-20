const getAlias = require('./getAlias');

describe('getAlias', () => {
  it('should throw if passed an invalid model name', () => {
    const modelLoadTest = () => getAlias('../InvalidModel');
    expect(modelLoadTest).toThrow();
  });

  it('should return null if passed a model that doesn\'t have an alias', () => {
    const alias = getAlias('InvalidModel');
    expect(alias).toEqual(null);
  });

  it('should return a valid model for a model that has an alias', () => {
    const alias = getAlias('Showers');
    expect(alias).toEqual('LocationFeatureSpecification');
  });
});
