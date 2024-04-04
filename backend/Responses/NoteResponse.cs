using backend.Data;

namespace backend.Responses;
public class NoteResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Category? Category { get; set; }
    public int CategoryId { get; set; }
    public bool IsActive { get; set; }
}