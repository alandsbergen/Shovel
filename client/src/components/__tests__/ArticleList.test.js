/**
 * @jest-environment jsdom
 */

import {render, screen} from '@testing-library/react';
import ArticleList from '../ArticleList';

function testRender(testArticles, showRender) {
    const {container, unmount} = render(<ArticleList articles={testArticles} />);
    if (showRender) {
        screen.debug();
    }
    unmount();
}

describe('Unit tests for ArticleList', () => {
    test('Function exists', () => {
        expect(ArticleList).toBeDefined();
    });

    test('Single article', () => {
        let testArticles = [{
            url: "https://www.washingtonpost.com/opinions/2022/11/29/israel-government-netanyahu-biden-palestinians-arabs/",
            urlToImage: "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/KZ5UN4P6LDHAXCSWM2HDM4WLUQ.jpg&w=916",
            title: "Biden should respond boldly to a radical Netanyahu government",
            author: "Aaron David Miller and Daniel C. Kurtzer",
            source: {
                name: "The Washington Post"
            }
        }];
        testRender(testArticles, false);
    });

    test('Single article, missing author', () => {
        let testArticles = [{
            url: "https://www.foxsports.com/stories/soccer/world-cup-now-reacapping-group-b-looking-head-to-usa-netherlands",
            urlToImage: "https://a57.foxsports.com/statics.foxsports.com/www.foxsports.com/content/uploads/2022/11/364/607/USA.jpg?ve=1&tl=1",
            title: "WORLD CUP NOW: USA DISPLAYS MATURITY IN VICTORY OVER IRAN",
            author: "",
            source: {
                name: "FOX Sports"
            }
        }];
        testRender(testArticles, false);
    });

    test('Three articles, some missing info', () => {
        let testArticles = [{
            url: "https://www.cnn.com/2022/11/29/health/gun-deaths-disparities/index.html",
            urlToImage: "",
            title: "America’s gun epidemic is deadlier than ever, and there are vast disparities in who’s dying",
            author: "Deidre McPhillips",
            source: {
                name: "CNN"
            }
        }, 
        {
            url: "https://www.economist.com/united-states/2022/11/29/how-will-america-deal-with-three-way-nuclear-deterrence",
            urlToImage: "https://www.economist.com/img/b/834/469/90/media-assets/image/20221126_CNP505.jpg",
            title: "How will America deal with three-way nuclear deterrence?",
            author: "",
            source: {
                name: "The Economist"
            }
        },
        {
            url: "https://www.forbes.com/sites/roberthart/2022/11/29/chinas-zero-covid-strategy-what-is-it-why-are-people-protesting-and-what-comes-next/?sh=6007345076a1",
            urlToImage: "",
            title: "China’s Zero-Covid Strategy: What Is It, Why Are People Protesting And What Comes Next",
            author: "Robert Hart",
            source: {
                name: "Forbes"
            }
        }];
        testRender(testArticles, false);
    });
});