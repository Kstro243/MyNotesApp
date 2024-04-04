using backend.Data;
using backend.Interfaces;
using backend.Responses;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;
public class NoteService : INoteService
{
    private readonly DataContext _context;
    public NoteService(DataContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<Note>> Create(Note noteToCreate)
    {
        if(_context.Note is null)
        {
            return new ApiResponse<Note>("Error in context, validate the sent object");
        }
        await _context.AddAsync(noteToCreate);
        await _context.SaveChangesAsync();
        return new ApiResponse<Note>(noteToCreate, "Your note has been created succesfully c:");
    }

    public async Task<ApiResponse<Note>> Delete(int noteId)
    {
        if(_context.Note is null)
        {
            return new ApiResponse<Note>("Error in context, validate the sent object");
        }
        var noteInDataBase = await _context.Note.FindAsync(noteId);
        if(noteInDataBase is null)
        {
            return new ApiResponse<Note>("The note you want to delete does not exists :/");
        }
        _context.Remove(noteInDataBase);
        await _context.SaveChangesAsync();
        return new ApiResponse<Note>(noteInDataBase, "Your note has been deleted succesfully c:");
    }

    public async Task<ApiResponse<Note>> Edit(Note noteToEdit)
    {
        if(_context.Note is null || _context.Category is null)
        {
            return new ApiResponse<Note>("Error in context, validate the sent object");
        }
        var noteInDataBase = await _context.Note.FindAsync(noteToEdit.Id);
        if(noteInDataBase is null)
        {
            return new ApiResponse<Note>("The note you want to edit does not exists :/");
        }
        bool categoryIdExists = await _context.Category.AnyAsync(cat => cat.Id == noteToEdit.CategoryId);
        if(!categoryIdExists)
        {
            return new ApiResponse<Note>("The note category chosen does not exists :/");
        }
        noteInDataBase.Title = noteToEdit.Title;
        noteInDataBase.Description = noteToEdit.Description;
        noteInDataBase.CategoryId = noteToEdit.CategoryId;
        noteInDataBase.IsActive = noteToEdit.IsActive;

        _context.Update(noteInDataBase);
        await _context.SaveChangesAsync();
        return new ApiResponse<Note>(noteToEdit, "Your note has been edited succesfully c:");
    }

    public async Task<ApiResponse<Note>> ChangeState(int noteId)
    {
        if(_context.Note is null || _context.Category is null)
        {
            return new ApiResponse<Note>("Error in context, validate the sent object");
        }
        var noteInDataBase = await _context.Note.FindAsync(noteId);
        if(noteInDataBase is null)
        {
            return new ApiResponse<Note>("The note you want to change the state does not exists :/");
        }

        noteInDataBase.IsActive = !noteInDataBase.IsActive;

        _context.Update(noteInDataBase);
        await _context.SaveChangesAsync();
        return new ApiResponse<Note>(noteInDataBase, $"Your note has been {(noteInDataBase.IsActive ? "activated" : "archived")} succesfully c:");
    }

    public async Task<ApiResponse<List<NoteResponse>>> GetAll()
    {
        if(_context.Note is null || _context.Category is null)
        {
            return new ApiResponse<List<NoteResponse>>("Error in context, validate the sent object");
        }

        var noteList = await _context.Note.ToListAsync();
        List<NoteResponse> noteListToResponse = new();
        foreach (var note in noteList)
        {
            var noteResponse = new NoteResponse
            {
                Id = note.Id,
                Title = note.Title,
                Description = note.Description,
                Category = await _context.Category.FindAsync(note.CategoryId),
                CategoryId = note.CategoryId,
                IsActive = note.IsActive
            };
            noteListToResponse.Add(noteResponse);
        }
        return new ApiResponse<List<NoteResponse>>(noteListToResponse);
    }
}