const loadModel = require('./loadModel');

describe('loadModel', function() {

    it('should throw if passed an invalid model name', function() {
        let modelLoadTest = () => loadModel('../InvalidModel');
        expect(modelLoadTest).toThrow();
    });

    it('should throw if passed a model that doesn\'t exist', function() {
        let modelLoadTest = () => loadModel('InvalidModel');
        expect(modelLoadTest).toThrow();
    });

    it('should return a valid model as JSON', function() {
        let modelData = loadModel('Event');
        expect(typeof modelData).toBe('object');
        expect(modelData.type).toBe('Event');
    });
});