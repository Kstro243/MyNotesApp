namespace backend.Responses;
public class ApiResponse<T>
{
    public T? Data { get; init; }
    public string? Message { get; init; }
    public ApiResponse(string message)
    {
        Message = message;
    }
    public ApiResponse(T data)
    {
        Data = data;
    }
    public ApiResponse(T data, string message)
    {
        Data = data;
        Message = message;
    }
}