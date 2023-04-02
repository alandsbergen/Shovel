import '../App.css'

// component for article list under each tab
export default function ArticleList({articles}) {
    const newsArticles = articles.map(({url, urlToImage, title, author, source}) => 
      <div className='card' key = {title}>
        <a href = {url} target="_blank">
          <div>
            <img src = {urlToImage} className = 'articleimg'/>
            <p className='article-title'>{title}</p>
            <hr/>
            <p className = 'subtitle'>{author}</p>
            <p className = 'subtitle'><b>{source.name}</b></p>
        </div>
        </a>
      </div> 
    );
  
    return (
        <div>
            <div className = "header">
                <h1 className='title'>Top Stories</h1>
            </div>
            <div>{newsArticles}</div>
        </div>
    );
}
        