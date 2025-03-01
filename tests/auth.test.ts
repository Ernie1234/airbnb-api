import request from 'supertest';
import app, { main } from '../src/index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let server: any;
const ENDPOINT = '/api/v1/auth/register';
const ENDPOINT_LOGIN = '/api/v1/auth/login';
const TEST_EMAIL = 'testuser@example.com';

beforeAll(async () => {
  jest.setTimeout(20_000); // Increase the timeout to 20 seconds
  server = await main(); // Start the server and store the instance
});

afterAll(() => {
  if (server) {
    server.close(); // Close the server
  }
});

describe('Auth Controller', () => {
  describe('POST /api/v1/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app).post(ENDPOINT).send({
        email: TEST_EMAIL,
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User created successfully');
      expect(res.body.user).toHaveProperty('email', TEST_EMAIL);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should return an error if passwords do not match', async () => {
      const res = await request(app).post(ENDPOINT).send({
        email: 'testuser2@example.com',
        password: 'password123',
        confirmPassword: 'differentPassword',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(undefined);
      expect(res.body.message).toBe(undefined);
    });

    it('should return an error if the user already exists', async () => {
      // Attempt to register the same user again
      const res = await request(app).post(ENDPOINT).send({
        email: TEST_EMAIL,
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(res.statusCode).toEqual(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/v1/login', () => {
    it('should log in an existing user successfully', async () => {
      const res = await request(app).post(ENDPOINT_LOGIN).send({
        email: TEST_EMAIL,
        password: 'password123',
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Sign-in successful');
      expect(res.body.user).toHaveProperty('email', TEST_EMAIL);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should return an error for invalid credentials', async () => {
      const res = await request(app).post(ENDPOINT_LOGIN).send({
        email: TEST_EMAIL,
        password: 'wrongpassword', // Wrong password
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid credentials!');
    });
  });
});
