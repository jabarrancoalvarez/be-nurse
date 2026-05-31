using BeNurse.Application.DTOs;

namespace BeNurse.Application.Interfaces;

public interface IContactService
{
    Task SubmitAsync(ContactFormDto dto);
}
