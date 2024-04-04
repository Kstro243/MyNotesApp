using backend.Data;
using backend.Responses;
namespace backend.Interfaces;
public interface INoteService
{
    Task<ApiResponse<List<NoteResponse>>> GetAll();
    Task<ApiResponse<Note>> Create(Note noteToCreate);
    Task<ApiResponse<Note>> Edit(Note noteToEdit);
    Task<ApiResponse<Note>> ChangeState(int noteId);
    Task<ApiResponse<Note>> Delete(int noteId);
}