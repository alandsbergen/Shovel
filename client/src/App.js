import './App.css';
import { useEffect, useState, useRef } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ArticleList from './components/ArticleList';
import Summary from './components/Summary';
import 'react-tabs/style/react-tabs.css';
import logo from './assets/shovel.png'
import handleNewsJSON from './scripts/handleNewsJSON';
import getData from './scripts/getData';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


function App() {
  const current = new Date();
  const date = `${monthNames[current.getMonth()]} ${current.getDate()}, ${1900 + current.getYear()}`;
  const [newsJson, setJson] = useState(null)
  // set default keyword to 'trump'
  const [highlightedText, setHighlightedText] = useState("trump")
  // set default sortBy option to 'relevancy'
  const [filter, setFilter] = useState('relevancy')
  const optionsRef = useRef(null);
  
  // once App component is mounted...
  useEffect(() => {
   // listen for custom event from ../public/popup.js
  document.addEventListener('keywords', function (event) {
    // extract NLP keywords from event
    var keyword = event.detail;
    setHighlightedText(keyword);
  });

    // when highlightedText and filter both are not null
    if (highlightedText && filter) {

      // update filter with currently selected sortBy option
      setFilter(optionsRef?.current.value);

      // make API call to express backend with keywords and filter
      getData(highlightedText, filter).then(response=> {
        
        // set newsJSON with response from NewsAPI
        setJson(response);
      }
      );
    }
  });

  // separate processed news articles by leaning
  let {leftLeaningArticles, 
    usedLeftLeaningSources, 
    centerLeaningArticles, 
    usedCenterLeaningSources,
    rightLeaningArticles, 
    usedRightLeaningSources} = handleNewsJSON(newsJson);

  // component formatting
  return (
    <div className="container">
      <div className = "header">
        <div className = 'logo-container'>
          <div className = 'inline'>
            <img src = {logo} className = 'logo'/>
          </div>
          <div className = 'inline'>
            <h1 className='title'>Shovel News</h1>
          </div>
        </div>
        <h1 className='title grey'>{date}</h1>

       <select id="options" ref={optionsRef}>
        <option value="relevancy">Relevancy</option>
        <option value="popularity">Popularity</option>
        <option value="publishedAt">Recency</option>
      </select>
      </div>
        <Tabs>
          <TabList>
            <Tab style = {{fontSize: 10, fontFamily: 'Inter'}}>Left Leaning</Tab>
            <Tab style = {{fontSize: 10, fontFamily: 'Inter'}}>Center Leaning</Tab>
            <Tab style = {{fontSize: 10, fontFamily: 'Inter'}}>Right Leaning</Tab>
            <Tab style = {{fontSize: 10, fontFamily: 'Inter'}}>Summary</Tab>
          </TabList>
          <TabPanel>
            <ArticleList articles={leftLeaningArticles}/>
          </TabPanel>
          <TabPanel>
            <ArticleList articles={centerLeaningArticles}/>
          </TabPanel>
          <TabPanel>
            <ArticleList articles={rightLeaningArticles}/>
          </TabPanel>
          <TabPanel>
            <Summary 
            leftdata = {usedLeftLeaningSources} 
            centerdata = {usedCenterLeaningSources} 
            rightdata = {usedRightLeaningSources}
            numleft = {leftLeaningArticles.length}
            numcenter = {centerLeaningArticles.length}
            numright = {rightLeaningArticles.length}
            />
          </TabPanel>
        </Tabs>
    </div>
  );
}

export default App;
