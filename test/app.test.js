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
      .expect(400, 
        { error: 'Bad request: One or more of your query parameters is invalid.' });
  });
});