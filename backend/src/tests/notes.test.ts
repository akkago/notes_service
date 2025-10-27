import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { ServiceBroker } from 'moleculer';
import ApiGateway from 'moleculer-web';

// Mock database for testing
const mockNotes = [
  {
    id: 1,
    title: 'Test Note 1',
    content: 'This is a test note',
    category: 'Test',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    title: 'Test Note 2',
    content: 'Another test note',
    category: 'Test',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

describe('Notes API', () => {
  let broker: ServiceBroker;
  let apiService: any;

  beforeAll(async () => {
    // Create test broker
    broker = new ServiceBroker({
      namespace: 'test',
      nodeID: 'test-node',
      logger: false,
      transporter: 'TCP'
    });

    // Create API Gateway
    apiService = broker.createService(ApiGateway, {
      name: 'api',
      settings: {
        port: 0, // Random port for testing
        routes: [
          {
            path: '/api',
            whitelist: ['notes.*'],
            use: [],
            mergeParams: true,
            authentication: false,
            authorization: false,
            autoAliases: true,
            aliases: {},
            mappingPolicy: 'all',
            logging: false
          }
        ]
      }
    });

    // Create mock notes service
    broker.createService({
      name: 'notes',
      actions: {
        list: {
          rest: 'GET /notes',
          handler() {
            return mockNotes;
          }
        },
        get: {
          rest: 'GET /notes/:id',
          params: { id: 'number' },
          handler(ctx) {
            const note = mockNotes.find(n => n.id === ctx.params.id);
            if (!note) throw new Error('Note not found');
            return note;
          }
        },
        create: {
          rest: 'POST /notes',
          params: {
            title: { type: 'string', min: 1 },
            content: { type: 'string', min: 1 },
            category: { type: 'string', optional: true }
          },
          handler(ctx) {
            const newNote = {
              id: mockNotes.length + 1,
              title: ctx.params.title,
              content: ctx.params.content,
              category: ctx.params.category,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            mockNotes.push(newNote);
            return newNote;
          }
        },
        update: {
          rest: 'PATCH /notes/:id',
          params: {
            id: 'number',
            title: { type: 'string', optional: true },
            content: { type: 'string', optional: true },
            category: { type: 'string', optional: true }
          },
          handler(ctx) {
            const note = mockNotes.find(n => n.id === ctx.params.id);
            if (!note) throw new Error('Note not found');
            
            if (ctx.params.title) note.title = ctx.params.title;
            if (ctx.params.content) note.content = ctx.params.content;
            if (ctx.params.category !== undefined) note.category = ctx.params.category;
            note.updatedAt = new Date();
            
            return note;
          }
        },
        remove: {
          rest: 'DELETE /notes/:id',
          params: { id: 'number' },
          handler(ctx) {
            const index = mockNotes.findIndex(n => n.id === ctx.params.id);
            if (index === -1) throw new Error('Note not found');
            mockNotes.splice(index, 1);
            return { message: 'Note deleted successfully' };
          }
        }
      }
    });

    await broker.start();
  });

  afterAll(async () => {
    await broker.stop();
  });

  describe('GET /api/notes', () => {
    it('should return all notes', async () => {
      const response = await request(apiService.server)
        .get('/api/notes')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title', 'Test Note 1');
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should return a specific note', async () => {
      const response = await request(apiService.server)
        .get('/api/notes/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('title', 'Test Note 1');
    });

    it('should return 404 for non-existent note', async () => {
      await request(apiService.server)
        .get('/api/notes/999')
        .expect(500); // Moleculer throws error, not 404
    });
  });

  describe('POST /api/notes', () => {
    it('should create a new note', async () => {
      const newNote = {
        title: 'New Test Note',
        content: 'This is a new test note',
        category: 'Test'
      };

      const response = await request(apiService.server)
        .post('/api/notes')
        .send(newNote)
        .expect(200);

      expect(response.body).toHaveProperty('title', 'New Test Note');
      expect(response.body).toHaveProperty('content', 'This is a new test note');
      expect(response.body).toHaveProperty('category', 'Test');
    });
  });

  describe('PATCH /api/notes/:id', () => {
    it('should update an existing note', async () => {
      const updateData = {
        title: 'Updated Test Note',
        content: 'This note has been updated'
      };

      const response = await request(apiService.server)
        .patch('/api/notes/1')
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('title', 'Updated Test Note');
      expect(response.body).toHaveProperty('content', 'This note has been updated');
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete a note', async () => {
      const response = await request(apiService.server)
        .delete('/api/notes/2')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Note deleted successfully');
    });
  });
});
