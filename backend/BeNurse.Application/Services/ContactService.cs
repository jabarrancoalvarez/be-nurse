using BeNurse.Application.DTOs;
using BeNurse.Application.Interfaces;
using BeNurse.Domain.Entities;

namespace BeNurse.Application.Services;

public class ContactService : IContactService
{
    private readonly IContactRepository _repository;

    public ContactService(IContactRepository repository)
    {
        _repository = repository;
    }

    public async Task SubmitAsync(ContactFormDto dto)
    {
        var form = new ContactForm
        {
            Name = dto.Name,
            Email = dto.Email,
            Subject = dto.Subject,
            Message = dto.Message,
            SubmittedAt = DateTime.UtcNow
        };

        await _repository.SaveAsync(form);
    }
}
