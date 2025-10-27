import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockNotes = [
  {
    id: 1,
    title: "Welcome to Notes Service",
    content: "This is your first note! You can edit or delete it.",
    category: "General",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Getting Started",
    content: "Here are some tips for using the notes service:\n\n1. Create new notes using the + button\n2. Click on any note to view or edit it\n3. Use categories to organize your notes\n4. Search through your notes using the search bar",
    category: "Tips",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Sample Note",
    content: "This is a sample note with some content. You can modify this text or delete this note entirely.",
    category: "Sample",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let notes = [...mockNotes];
let nextId = 4;

// Routes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find(n => n.id === id);
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.json(note);
});

app.post('/api/notes', (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  
  const newNote = {
    id: nextId++,
    title,
    content,
    category: category || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  notes.unshift(newNote);
  res.status(201).json(newNote);
});

app.patch('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const noteIndex = notes.findIndex(n => n.id === id);
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }
  
  const { title, content, category } = req.body;
  const note = notes[noteIndex];
  
  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  if (category !== undefined) note.category = category;
  note.updatedAt = new Date().toISOString();
  
  res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const noteIndex = notes.findIndex(n => n.id === id);
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }
  
  notes.splice(noteIndex, 1);
  res.json({ message: 'Note deleted successfully' });
});

app.get('/api/notes/search', (req, res) => {
  const query = req.query.query as string;
  if (!query) {
    return res.json(notes);
  }
  
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(query.toLowerCase()) ||
    note.content.toLowerCase().includes(query.toLowerCase())
  );
  
  res.json(filteredNotes);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Notes API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Notes API server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please stop the process using this port or change the PORT in .env file.`);
    process.exit(1);
  } else {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
});
