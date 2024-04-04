using backend.Data;
using backend.Interfaces;
using backend.Responses;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class NoteController : ControllerBase
{
    private readonly INoteService _noteService;
    public NoteController(INoteService noteService)
    {
        _noteService = noteService;
    }
    [HttpPost("Create")]
    public async Task<ApiResponse<Note>> Create(Note noteToCreate)
    {
        return await _noteService.Create(noteToCreate);
    }
    [HttpGet("Get")]
    public async Task<ApiResponse<List<NoteResponse>>> Get()
    {
        return await _noteService.GetAll();
    }
    [HttpPut("Update")]
    public async Task<ApiResponse<Note>> Edit(Note noteToEdit)
    {
        return await _noteService.Edit(noteToEdit);
    }
    [HttpPut("ChangeState")]
    public async Task<ApiResponse<Note>> ChangeState(int noteId)
    {
        return await _noteService.ChangeState(noteId);
    }
    [HttpDelete("Delete")]
    public async Task<ApiResponse<Note>> Delete(int noteId)
    {
        return await _noteService.Delete(noteId);
    }   
}