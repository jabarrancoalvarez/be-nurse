using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace BeNurse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IConfiguration config, ILogger<AuthController> logger)
    {
        _config = config;
        _logger = logger;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        var expectedEmail = _config["NurseCredentials:Email"];
        var expectedPassword = _config["NurseCredentials:Password"];

        // Sin credenciales configuradas no se entra: de lo contrario, unos valores
        // vacios dejarian la sesion de administrador abierta a cualquiera.
        if (string.IsNullOrWhiteSpace(expectedEmail) || string.IsNullOrWhiteSpace(expectedPassword))
        {
            _logger.LogError("Intento de acceso sin NurseCredentials configuradas.");
            return Unauthorized(new { message = "El acceso no esta configurado en el servidor." });
        }

        var emailOk = string.Equals(dto.Email?.Trim(), expectedEmail, StringComparison.OrdinalIgnoreCase);
        var passwordOk = FixedTimeEquals(dto.Password, expectedPassword);

        if (!emailOk || !passwordOk)
        {
            return Unauthorized(new { message = "Credenciales incorrectas" });
        }

        return Ok(new { token = GenerateToken(expectedEmail) });
    }

    /// <summary>Comparacion de tiempo constante: no filtra cuantos caracteres coinciden.</summary>
    private static bool FixedTimeEquals(string? provided, string expected)
    {
        if (provided is null) return false;

        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(provided),
            Encoding.UTF8.GetBytes(expected));
    }

    private string GenerateToken(string email)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, "Nurse")
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public record LoginDto(string Email, string Password);
