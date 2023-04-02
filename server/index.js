var request = require('request')
const express = require('express')
const dotenv = require('dotenv');
const app = express()
const fs = require('fs')
const { post } = require('request')
const { response } = require('express')
const port = 8081

dotenv.config({ path: './.env' });

// home page of server
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// API call will be made from ../client/src/scripts/getData.js
// makes GET request to NewsAPI with request parameters
app.get('/endpoint', (req, res) => {
    let url = `https://newsapi.org/v2/everything?
    q=${req.query.keyword}
    &sortBy=${req.query.filter}
    &apiKey=${process.env.MY_API_KEY}`

    // cleans any whitespace in url
    url = url.replace(/\s+/g, '')

    // creates header for GET request
    var options = {
        url: url,
        headers: {
            'User-Agent': 'Shovel'
        }
    }
    request(options,
        function(error, response, body){
            
            if (!error && response.statusCode == 200) {
                // if no errors, returns JSON object of fetched news articles
                res.send(body)
            }
        })
  })

// sanity check to make sure server is running
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})