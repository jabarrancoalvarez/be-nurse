using BeNurse.Domain.Entities;

namespace BeNurse.Application.Interfaces;

public interface IContactRepository
{
    Task SaveAsync(ContactForm form);
}
