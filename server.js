const http  = require('http');
const fs = require('fs');
const path = require('path');
const request = require('request');

const fileList = [
    'https://frontend-coding-challenge.s3.amazonaws.com/1.txt',
    'https://frontend-coding-challenge.s3.amazonaws.com/2.txt',
    'https://frontend-coding-challenge.s3.amazonaws.com/3.txt'
]

/*
 * Get data from text files
 * */
var wordsList = [];
function requestFilesData() {
    fileList.forEach(element =>{
        request(element).pipe(fs.createWriteStream('temp.txt', {flags:'a'}));
        setTimeout(readFile, 3000);
    });
    return wordsList;
}

function readFile() {
    fs.readFile('temp.txt', 'utf8', function (err, data) {

        if (err) throw err;

        let wordsArray = splitByWords(data);
        let wordsMap = createWordMap(wordsArray);
        wordsList = sortByCount(wordsMap);
        console.log(wordsList.splice(5));
        console.log(wordsList);
    });
    return wordsList;

}

/*
 * Split words and get frequency
 * */

function splitByWords (text) {
    // split string by spaces (including spaces, tabs, and newlines)
    let wordsArray = text.split(/\s+/);
    return wordsArray;
}


function createWordMap (wordsArray) {

    // create map for word counts
    let wordsMap = {};
    wordsArray.forEach(function (key) {
        if (wordsMap.hasOwnProperty(key)) {
            wordsMap[key]++;
        } else {
            wordsMap[key] = 1;
        }
    });

    return wordsMap;

}


function sortByCount (wordsMap) {

    // sort by count in descending order
    let finalWordsArray = [];
    finalWordsArray = Object.keys(wordsMap).map(function(key) {
        return {
            name: key,
            total: wordsMap[key]
        };
    });

    finalWordsArray.sort(function(a, b) {
        return b.total - a.total;
    });

    return finalWordsArray;

}

/*
 * Add a GET route to send the JSON containing the words
 * */

function sendResponse(req, res, url){
    fs.readFile("index.html", function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
}
function getHandler(req, res, reqUrl) {
    res.writeHead(200);
    requestFilesData();
    res.write(JSON.stringify(wordsList));
    res.end();
}

const httpServer = http.createServer( function(req,res) {
    /* Adding CORS headers */
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    const router = {
        'GET/topWords': getHandler,
        'default': sendResponse,
    };
    console.log(`Request came: ${req.url}`);
    let reqUrl = new URL(req.url, 'http://127.0.0.1');
    let redirectedFunc = router[req.method + reqUrl.pathname] || router['default'];
    redirectedFunc(req, res, reqUrl);
});

httpServer.listen(3000, () => {
    console.log('Listening on port 3000...')
});
