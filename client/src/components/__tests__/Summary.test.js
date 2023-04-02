/**
 * @jest-environment jsdom
 */

import '../../../../__mocks__/mockJsdom';
import {render, screen} from '@testing-library/react';
import Summary from '../Summary';

function testRender(testSources, showRender) {
    const {container, unmount} = render(<Summary leftdata = {testSources.left} 
        centerdata = {testSources.center} 
        rightdata = {testSources.right} />);
    if (showRender) {
        screen.debug();
    }
    unmount();
}

describe('Unit tests for Summary', () => {
    test('Function exists', () => {
        expect(Summary).toBeDefined();
    });

    test('One of each source', () => {
        let testSources = {
            left: [
                "19th News",
                44.5,
                -10.31
            ],
            center: [
                "Air Force Times",
                46.01,
                1.32
            ],
            right: [
                "#MediaBuzz",
                35.44,
                9.67
            ]
        };
        testRender(testSources, true);
    });
 });