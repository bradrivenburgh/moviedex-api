require('dotenv').config()
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('GET /movie', () => {
  it('should return 401 if authToken is invalid or missing', () => {
    return supertest(app)
      .get('/movie')
      .expect(401, { error: 'Unauthorized request' })
  });

  it('should return 400 if query params are invalid', () => {
    return supertest(app)
      .get('/movie')
      .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
      .query({mistake: 'mistake'})
      .expect(400, 
        { error: 'Bad request: One or more of your query parameters is invalid.' });
  });

  it('should return an array of all movies if no query params are provided', () => {
    return supertest(app)
      .get('/movie')
      .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.a.lengthOf(88);
      });
  });

  it('should return filtered list of movies by genre, country, and avg_vote', () => {
    return supertest(app)
    .get('/movie')
    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    .query({genre: 'Action', country: 'China', avg_vote: 7})
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res.body).to.have.a.lengthOf.of.at.least(1);
      expect(res.body).to.deep.include.members([  
        {
          "filmtv_ID": 50,
          "film_title": "Free Fighter",
          "year": 1990,
          "genre": "Action",
          "duration": 88,
          "country": "United States, China",
          "director": "Liu Chia Yung",
          "actors": "Cynthia Rothrock, Mark Huston, Tong Chung, Shing Fulon",
          "avg_vote": 7,
          "votes": 2
        }      
      ]);
    });
  });

  it('should have a movie object with the correct properties', () => {
    return supertest(app)
    .get('/movie')
    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    .query({genre: 'Action', country: 'China', avg_vote: 7})
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res.body[0]).to.have.all.keys(
        'filmtv_ID', 'film_title', 'year', 'genre', 'duration',
        'country', 'director', 'actors', 'avg_vote', 'votes'
      );
    });
  });
});