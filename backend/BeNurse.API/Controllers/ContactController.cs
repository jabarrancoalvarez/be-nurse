using BeNurse.Application.DTOs;
using BeNurse.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BeNurse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactController(IContactService contactService)
    {
        _contactService = contactService;
    }

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] ContactFormDto dto)
    {
        await _contactService.SubmitAsync(dto);
        return Ok();
    }
}
