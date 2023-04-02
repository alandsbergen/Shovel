// makes API call to express backend endpoint in ../../../server/index.js
// returns list of news article given by NewsAPI
export default async function getData (info, filter) {
    let url = `http://localhost:8081/endpoint?
    keyword=${info}&filter=${filter}`

    // replace whitespace in url
    url = url.replace(/\s+/g, '');
    const response = await fetch(url);
    const data = await response.json();

    // return news article list
    return data;
  };