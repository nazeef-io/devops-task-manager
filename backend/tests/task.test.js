const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const createApp = require('../src/app');
const Task = require('../src/models/Task');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  app = createApp();
});

afterEach(async () => {
  await Task.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Health endpoint', () => {
  it('GET /health should return 200 and a success status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Task API', () => {
  it('POST /api/tasks should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task', description: 'Test Description' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Test Task');
    expect(res.body.data.status).toBe('pending');
  });

  it('POST /api/tasks should reject a task without a title', async () => {
    const res = await request(app).post('/api/tasks').send({ description: 'No title here' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/tasks should return all tasks', async () => {
    await Task.create({ title: 'Task 1' });
    await Task.create({ title: 'Task 2' });

    const res = await request(app).get('/api/tasks');

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
    expect(res.body.data.length).toBe(2);
  });

  it('GET /api/tasks/:id should return a single task', async () => {
    const task = await Task.create({ title: 'Find Me' });

    const res = await request(app).get(`/api/tasks/${task._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Find Me');
  });

  it('GET /api/tasks/:id should return 404 for a non-existent id', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app).get(`/api/tasks/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('PUT /api/tasks/:id should update a task', async () => {
    const task = await Task.create({ title: 'Old Title' });

    const res = await request(app)
      .put(`/api/tasks/${task._id}`)
      .send({ title: 'Updated Title' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Updated Title');
  });

  it('PATCH /api/tasks/:id/status should update the status', async () => {
    const task = await Task.create({ title: 'Status Task' });

    const res = await request(app)
      .patch(`/api/tasks/${task._id}/status`)
      .send({ status: 'completed' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('completed');
  });

  it('DELETE /api/tasks/:id should remove a task', async () => {
    const task = await Task.create({ title: 'Delete Me' });

    const res = await request(app).delete(`/api/tasks/${task._id}`);
    expect(res.statusCode).toBe(200);

    const check = await Task.findById(task._id);
    expect(check).toBeNull();
  });
});
