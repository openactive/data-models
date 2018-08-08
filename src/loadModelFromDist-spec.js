const loadModelFromDist = require('./loadModelFromDist');

describe('loadModelFromDist', () => {
  it('should throw if passed an invalid model name', () => {
    const modelLoadTest = () => loadModelFromDist('../InvalidModel');
    expect(modelLoadTest).toThrow();
  });

  it('should throw if passed a model that doesn\'t exist', () => {
    const modelLoadTest = () => loadModelFromDist('InvalidModel');
    expect(modelLoadTest).toThrow();
  });

  it('should throw if passed an invalid spec version', () => {
    const modelLoadTest = () => loadModelFromDist('Event', '0.0');
    expect(modelLoadTest).toThrow();
  });

  it('should return a valid model as JSON', () => {
    const modelData = loadModelFromDist('Event');
    expect(typeof modelData).toBe('object');
    expect(modelData.type).toBe('Event');
  });
  it('should return inherited properties from parent classes', () => {
    const modelData = loadModelFromDist('Showers');
    expect(typeof modelData).toBe('object');
    expect(modelData.type).toBe('Showers');
    expect(modelData.subClassGraph.length).toBe(1);
    expect(modelData.subClassGraph[0]).toBe('#LocationFeatureSpecification');
    expect(typeof modelData.fields.value).toBe('object');
    expect(modelData.fields.value.inheritedFrom).toBe('#LocationFeatureSpecification');
    expect(modelData.fields.type.requiredContent).toBe('Showers');
  });
});
