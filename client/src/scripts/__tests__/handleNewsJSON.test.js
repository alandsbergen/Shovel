import handleNewsJSON from '../handleNewsJSON';
import stringTestNews from './testNews.json';

let testNews = JSON.parse(stringTestNews)

describe('Unit tests for handleNewsJSON', () => {

    // test whether function exists
    test('Function exists', () => {
        expect(handleNewsJSON).toBeDefined();
    });

    const info = handleNewsJSON(testNews);

    // test that function is successful and return value is defined
    test('Function returns', () => {
        expect(info).toBeDefined();
    });

    // test that output is expected: at least one new source is identified and rated
    test('Returns at least one non-empty list', () => {
        let empty = true;
        for (let [key, value] of Object.entries(info)) {
            if (value.length != 0) {
                // inner array contains something
                empty = false;
            }
            else if (!Array.isArray(value)) {
                // some non-array element
                empty = false;
            }
        }
        expect(empty).toBeFalsy();
    });

    // test that news data is successfully compared to bias database
    test('Successfully finds and saves Wired article', () => {
        let foundWired = false;
        for (let [key, value] of Object.entries(info)) {
            if (value.length != 0) {

                // if news source is 'WIRED'
                if (Array.isArray(value[0]) && value[0][0] === 'WIRED') {
                    foundWired = true;
                }
            }
        }
        expect(foundWired).toBeTruthy();
    });
});