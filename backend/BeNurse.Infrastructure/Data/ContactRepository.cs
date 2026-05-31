using BeNurse.Application.Interfaces;
using BeNurse.Domain.Entities;

namespace BeNurse.Infrastructure.Data;

public class ContactRepository : IContactRepository
{
    private readonly BeNurseDbContext _context;

    public ContactRepository(BeNurseDbContext context)
    {
        _context = context;
    }

    public async Task SaveAsync(ContactForm form)
    {
        _context.ContactForms.Add(form);
        await _context.SaveChangesAsync();
    }
}
