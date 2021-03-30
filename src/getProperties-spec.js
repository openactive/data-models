const getProperties = require('./getProperties');

describe('getProperties', () => {
  it('should include https://schema.org/name', () => {
    const properties = getProperties();
    expect(properties.has('https://schema.org/name')).toBe(true);
  });
  it('should include https://openactive.io/activity', () => {
    const properties = getProperties();
    expect(properties.has('https://openactive.io/activity')).toBe(true);
  });
});
