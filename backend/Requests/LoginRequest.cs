using System.ComponentModel.DataAnnotations;

namespace backend.Request;
public class LoginRequest
{
    [Required]
    public string Email { get; set; } = string.Empty;
    [Required]
    public string PassWord { get; set; } = string.Empty;
}