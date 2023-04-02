/**
 * @jest-environment jsdom
 */

//import {render} from '@testing-library/react';
//import App, {searchInput} from '../App';

describe('App integration tests', () => {
    it('placeholder', () => {
        expect(1).toBe(1);
    });
    
    // want to check the component rendering after running a search,
    // without calling NewsAPI (so need to mock searchInput())
});

/*it('Renders without errors', () => {
    expect(1).toBe(1);
    //const {container, unmount} = render(<App />);
    //unmount();
});*/

 
