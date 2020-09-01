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

  console.log('Now validating bearer token...');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  next();
});

/**
function filterGenreOrCountry(response, genre = null, country = null) {
  return response = response.filter(movie =>{
    if(genre){
      return movie.genre.toLowerCase().includes(genre.toLowerCase())
    } else if(country){
      return movie.country.toLowerCase().includes(country.toLowerCase())
    }
  });
/**/

function filterByParam(response, obj) {
  return filteredResponse = response.filter(movie => {
    let prop = Object.keys(obj)[0];
    return movie[prop].toLowerCase().includes(obj[prop].toLowerCase());
  });
}

function handleGetMovie(req, res) {
  // Response without query params
  const response = MOVIEDEX;
  let filteredResponse;

  // Ensure params are valid 
  let validateParams = [];
  validateParams = Object.keys(req.query).map(param => 
    ['genre', 'country', 'avg_vote'].includes(param.toLowerCase())
  );

  if (validateParams.includes(false)) {
    console.log('One of your params is invalid')
  } else {
    // Retrieve query values
    const { genre, country, avg_vote } = req.query;
    filterByParam(response, {genre});
    filterByParam(response, {country});
    if (avg_vote) {
      filteredResponse = response.filter(movie => 
        movie.avg_vote >= Number(avg_vote));  
    }  
  }

  // Filter if query params are present
  
  // const { genre, country, avg_vote } = req.query;

  // // Filter by genre if it is provided; make case insensitive
  // if (genre) {
  //   filterByParam(response, {genre}); // {genre:value}
  //   // response = response.filter(movie => 
  //   //   movie.genre.toLowerCase().includes(genre.toLowerCase()));
  // }

  // if (country) {
  //   response = response.filter(movie => 
  //     movie.country.toLowerCase().includes(country.toLowerCase()));
  // }

  // if (avg_vote) {
  //   response = response.filter(movie => 
  //     movie.avg_vote >= Number(avg_vote));  
  // }

  // Send back results
  res.json(filteredResponse);
}

app.get('/movie', handleGetMovie);

module.exports = app;