import request from 'supertest';
import app, { main } from '../src/index'; // Correctly import app and main

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let server: any; // Declare a variable to hold the server instance

beforeAll(async () => {
  jest.setTimeout(20_000); // Increase the timeout to 20 seconds
  server = await main(); // Start the server and store the instance
});

afterAll(() => {
  if (server) {
    // Check if server is defined
    server.close(); // Close the server
  }
});

describe('GET /', () => {
  it('should return Welcome to Express & TypeScript Server', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Welcome to Express & TypeScript Server');
  });

  it('should return Working in good health', async () => {
    const res = await request(app).get('/healths');

    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Working in good health');
  });
});
