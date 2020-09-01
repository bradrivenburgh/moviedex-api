require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIEDEX = require('./moviedex.json');

const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateToken(req, res, next) {
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  next();
});

function filterByParam(response, queryParams) {
  // Assign response to new variable to avoid mutating original data
  filteredResponse = response;

  // Convert the query object to an array. Loop over the array  
  // and conduct the appropriate filtering operation for each param
  Object.keys(queryParams).forEach(param => {
    if (param.toLowerCase() !== 'avg_vote') {
      filteredResponse = filteredResponse.filter(movie => 
        movie[param].toLowerCase().includes(queryParams[param].toLowerCase())
      );    
    } else if (param.toLowerCase() === 'avg_vote') {
      filteredResponse = filteredResponse.filter(movie => 
        movie[param] >= Number(queryParams[param]));  
    }
  });

  return filteredResponse;
}

function handleGetMovie(req, res) {
  const response = MOVIEDEX;
  let filteredResponse;

  // Ensure params are valid 
  let validateParams = [];
  validateParams = Object.keys(req.query).map(param => 
    ['genre', 'country', 'avg_vote'].includes(param.toLowerCase())
  );

  // Send 401 error if there is a problem with one of the params
  if (validateParams.includes(false)) {
    return res
      .status(400)
      .json({
        error: 'Bad request: One or more of your query parameters is invalid.'
      })
  }

  // Filter response object if query params are valid
  filteredResponse = filterByParam(response, req.query);

  // Notify client if there are no movies that satisfy the search criteria
  if (!filteredResponse.length) {
    res.json({
      no_match: 'There are no movies in the database that satisfy your search criteria.'
    })
  }
  
  // Send back results as JSON
  res.json(filteredResponse);
}

app.get('/movie', handleGetMovie);

module.exports = app;