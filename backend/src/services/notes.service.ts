import { Service, Context, ServiceSchema } from "moleculer";
import { AppDataSource } from "../config/database";
import { Note } from "../entities/note.entity";

// Mock data for demonstration
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

export default {
  name: "notes",
  actions: {
    list: {
      rest: "GET /notes",
      async handler() {
        try {
          if (AppDataSource.isInitialized) {
            const noteRepository = AppDataSource.getRepository(Note);
            const notes = await noteRepository.find({
              order: { createdAt: "DESC" }
            });
            return notes;
          } else {
            // Return mock data if database is not available
            return mockNotes;
          }
        } catch (error) {
          // Database not available, returning mock data
          return mockNotes;
        }
      }
    },
    
    get: {
      rest: "GET /notes/:id",
      params: {
        id: "number"
      },
      async handler(ctx: Context<any, { id: number }>) {
        const noteRepository = AppDataSource.getRepository(Note);
        const note = await noteRepository.findOne({
          where: { id: ctx.params.id }
        });
        
        if (!note) {
          throw new Error("Note not found");
        }
        
        return note;
      }
    },
    
    create: {
      rest: "POST /notes",
      params: {
        title: { type: "string", min: 1, max: 255 },
        content: { type: "string", min: 1 },
        category: { type: "string", optional: true, max: 50 }
      },
      async handler(ctx: Context<any, { title: string; content: string; category?: string }>) {
        const noteRepository = AppDataSource.getRepository(Note);
        const note = noteRepository.create({
          title: ctx.params.title,
          content: ctx.params.content,
          category: ctx.params.category
        });
        
        const savedNote = await noteRepository.save(note);
        return savedNote;
      }
    },
    
    update: {
      rest: "PATCH /notes/:id",
      params: {
        id: "number",
        title: { type: "string", optional: true, min: 1, max: 255 },
        content: { type: "string", optional: true, min: 1 },
        category: { type: "string", optional: true, max: 50 }
      },
      async handler(ctx: Context<any, { id: number; title?: string; content?: string; category?: string }>) {
        const noteRepository = AppDataSource.getRepository(Note);
        const note = await noteRepository.findOne({
          where: { id: ctx.params.id }
        });
        
        if (!note) {
          throw new Error("Note not found");
        }
        
        // Update only provided fields
        if (ctx.params.title !== undefined) note.title = ctx.params.title;
        if (ctx.params.content !== undefined) note.content = ctx.params.content;
        if (ctx.params.category !== undefined) note.category = ctx.params.category;
        
        const updatedNote = await noteRepository.save(note);
        return updatedNote;
      }
    },
    
    remove: {
      rest: "DELETE /notes/:id",
      params: {
        id: "number"
      },
      async handler(ctx: Context<any, { id: number }>) {
        const noteRepository = AppDataSource.getRepository(Note);
        const note = await noteRepository.findOne({
          where: { id: ctx.params.id }
        });
        
        if (!note) {
          throw new Error("Note not found");
        }
        
        await noteRepository.remove(note);
        return { message: "Note deleted successfully" };
      }
    },
    
    search: {
      rest: "GET /notes/search",
      params: {
        query: "string"
      },
      async handler(ctx: Context<any, { query: string }>) {
        const noteRepository = AppDataSource.getRepository(Note);
        const notes = await noteRepository
          .createQueryBuilder("note")
          .where("note.title LIKE :query OR note.content LIKE :query", {
            query: `%${ctx.params.query}%`
          })
          .orderBy("note.createdAt", "DESC")
          .getMany();
        
        return notes;
      }
    }
  }
};
