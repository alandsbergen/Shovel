window.addEventListener('DOMContentLoaded', () => {
  // ...query for the active tab...
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    // ...and send a request for the text info...
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'text'},
        getData);
  });
});

// callback function from popup message
// takes highlighted text (info) and makes a POST request to the Flask server 
// where the Python NLP algorithm will extract the most relevant keywords
// handled in ../../backend/app.py

const getData = async (info) => {

  let data = info?.text;

  // create header for POST request
	var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://127.0.0.1:8000/data",
    "method": "POST",
    "headers": {
      "content-type": "application/json"
    },
    "data": JSON.stringify(data)
  }

  // formatting for POST request
  var xhttp = new XMLHttpRequest();
  var post_data = JSON.stringify({"data":encodeURIComponent(data)});
  xhttp.open(settings.method, settings.url, settings.async);
  xhttp.setRequestHeader("Content-type", "application/json");

  // make post request
	xhttp.send(post_data);
  
  // when NLP algorithms finish running
  xhttp.onreadystatechange = async function(){
    // save extracted keywords into obj
    var obj = JSON.stringify(this.responseText).replace(/\s+/g, '-');;

    // send event to indicate that keywords have been extracted 
    // event is received by ../src/App.js
    document.dispatchEvent(new CustomEvent('keywords', {detail: obj}));
  }
};
