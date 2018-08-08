const getMetaData = require('./getMetaData');

describe('getMetaData', () => {
  it('should throw if passed an invalid spec version', () => {
    const modelLoadTest = () => getMetaData('0.0');
    expect(modelLoadTest).toThrow();
  });

  it('should valid metaData as JSON', () => {
    const metaData = getMetaData('2.0');
    expect(typeof metaData).toBe('object');
    expect(metaData.openActivePrefix).toBe('oa');
  });
});
