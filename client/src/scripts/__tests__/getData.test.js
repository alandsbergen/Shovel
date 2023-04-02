import getData from '../getData';

describe('Unit tests for getData', () => {
    test('Function exists', () => {
        expect(getData).toBeDefined();
    });

    // these don't work, and moreover, we don't want to actually call newsAPI
    // can revisit this if I figure out how to mock the remote call
    
    /*const result = getData("test input");
    test('Function returns', () => {
        expect(result).toBeDefined();
    });

    test('Result is a JSON string', () => {
        let valid = true;
        try {
            JSON.parse(result);
        } catch (err) {
            valid = false;
        }
        expect(valid).toBeTruthy();
    });*/
});