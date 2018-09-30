const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses');
const jsonHandler = require('./jsonResponses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addFighter') {
    const body = [];

    request.on('error', (err) => {
      // if there is an error
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      // last piece of info has come through
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      jsonHandler.addFighter(request, response, bodyParams);
    });
  } else if (parsedUrl.pathname === '/removeFighter') {
    const body = [];

    request.on('error', (err) => {
      // if there is an error
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      // last piece of info has come through
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      jsonHandler.removeFighter(request, response, bodyParams);
    });
  }
};

const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getFighters') {
    jsonHandler.getFighters(request, response);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/bundle.js') {
    htmlHandler.getBundle(request, response);
  } else {
    jsonHandler.notFound(request, response);
  }
};

const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getFighters') {
    //
    jsonHandler.getFightersMeta(request, response);
  } else {
    // not real. Give a 404
    jsonHandler.notFoundMeta(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  // check the method
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'GET') {
    handleGet(request, response, parsedUrl);
  } else {
    // HEAD
    handleHead(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
