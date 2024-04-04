using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Configurations;
using backend.Request;
using backend.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers;
[ApiController]
[Route("api/[controller]")]
public class AuthenticationController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly JwtConfig _jwtConfig;
    public AuthenticationController
    (
        UserManager<IdentityUser> userManager,
        IOptionsMonitor<JwtConfig> optionsMonitor
    )
    {
        _userManager = userManager;
        _jwtConfig = optionsMonitor.CurrentValue;
    }

    [HttpPost("Register")]
    public async Task<ApiResponse<LoginResponse>> Register(LoginRequest loginRequest)
    {
        if(ModelState.IsValid)
        {
            var emailExists = await _userManager.FindByEmailAsync(loginRequest.Email);
            if(emailExists is not null) 
                return new ApiResponse<LoginResponse>("This email already exists");

            var newUser = new IdentityUser()
            {
                Email = loginRequest.Email,
                UserName = loginRequest.Email
            };

            var createUser = await _userManager.CreateAsync(newUser, loginRequest.PassWord);

            if(createUser.Succeeded)
            {
                var response = new LoginResponse()
                {
                    Token = GenerateJwtToken(newUser)
                };
                return new ApiResponse<LoginResponse>(response);
            }
            return new ApiResponse<LoginResponse>("The registration of user has failed, please try again");
        }
        return new ApiResponse<LoginResponse>("Invalid request, review your payload");
    }

    [HttpPost("Login")]
    public async Task<ApiResponse<LoginResponse>> Login(LoginRequest userToLog)
    {
        if(ModelState.IsValid)
        {
            var userExists = await _userManager.FindByEmailAsync(userToLog.Email);
            if(userExists is null)
                return new ApiResponse<LoginResponse>("The user does not exists"); 
            var isPasswordCorrect = await _userManager.CheckPasswordAsync(userExists, userToLog.PassWord);
            if(!isPasswordCorrect)
            {
                return new ApiResponse<LoginResponse>("Password invalid");
            }

            var token = GenerateJwtToken(userExists);
            var response = new LoginResponse()
            {
                Token = token
            };
                return new ApiResponse<LoginResponse>(response);
        }
        return new ApiResponse<LoginResponse>("Invalid request, review your payload");
    }

    private string GenerateJwtToken(IdentityUser userToRegister)
    {
        var jwtTokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtConfig.Secret);
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity
            (new []
                {
                    new Claim(type: "Id", userToRegister.Id),
                    new Claim(JwtRegisteredClaimNames.Sub, userToRegister.Email),
                    new Claim(JwtRegisteredClaimNames.Email, userToRegister.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                }
            ),
            Expires = DateTime.UtcNow.AddHours(0.5),
            SigningCredentials = new SigningCredentials
            (
                new SymmetricSecurityKey(key), 
                SecurityAlgorithms.HmacSha512
            )

        };

        var token = jwtTokenHandler.CreateToken(tokenDescriptor);
        var jwtToken = jwtTokenHandler.WriteToken(token);
        return jwtToken;
    }
}