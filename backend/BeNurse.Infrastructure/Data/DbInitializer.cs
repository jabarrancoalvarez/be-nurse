using BeNurse.Domain.Entities;

namespace BeNurse.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task Initialize(BeNurseDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (context.Articles.Any()) return;

        var articles = new List<Article>
        {
            new()
            {
                Title = "Definicion de Infeccion de Transmision Sexual",
                Slug = "definicion-its",
                Category = "informate",
                SubCategory = "definicion",
                AuthorName = "Equipo be-nurse",
                Content = "Las Infecciones de Transmision Sexual (ITS) se caracterizan por contagiarse a traves del contacto sexual. En la mayoria de los casos las manifestaciones clinicas comprometen la zona genital y las mucosas, dando lugar a complicaciones medicas. Ademas, muchas de estas infecciones pueden no ser sintomaticas, por lo que se dificulta su tratamiento y diagnostico.",
                Excerpt = "Que son las ITS y por que es importante conocerlas.",
                PublishedAt = new DateTime(2026, 2, 1, 0, 0, 0, DateTimeKind.Utc),
                IsPublished = true,
                ImageUrl = ""
            },
            new()
            {
                Title = "VIH: que es y como se transmite",
                Slug = "vih-que-es",
                Category = "informate",
                SubCategory = "its-comunes",
                AuthorName = "Ana Morales",
                Content = "El Virus de Inmunodeficiencia Humana (VIH) ataca el sistema inmunitario del cuerpo, concretamente los linfocitos T CD4. Sin tratamiento, puede progresar a SIDA. Hoy en dia, con tratamiento antirretroviral, las personas con VIH pueden llevar una vida larga y saludable.",
                Excerpt = "Todo lo que necesitas saber sobre el Virus de Inmunodeficiencia Humana.",
                PublishedAt = new DateTime(2026, 2, 5, 0, 0, 0, DateTimeKind.Utc),
                IsPublished = true,
                ImageUrl = ""
            },
            new()
            {
                Title = "VPH: Virus del Papiloma Humano",
                Slug = "vph-virus-papiloma",
                Category = "informate",
                SubCategory = "its-comunes",
                AuthorName = "Ana Morales",
                Content = "El Virus del Papiloma Humano (VPH) es la infeccion de transmision sexual mas frecuente en el mundo. Existen mas de 100 tipos diferentes. Algunos pueden causar verrugas genitales y otros estan relacionados con el desarrollo de cancer de cuello uterino, anal, orofaringeo y de pene.",
                Excerpt = "El VPH es la ITS mas frecuente en el mundo. Te explicamos todo.",
                PublishedAt = new DateTime(2026, 2, 6, 0, 0, 0, DateTimeKind.Utc),
                IsPublished = true,
                ImageUrl = ""
            },
            new()
            {
                Title = "Clamidia: la ITS silenciosa",
                Slug = "clamidia",
                Category = "informate",
                SubCategory = "its-comunes",
                AuthorName = "Javier Ruiz",
                Content = "La clamidia es causada por la bacteria Chlamydia trachomatis. Es una de las ITS mas comunes y la mayoria de las personas infectadas no presentan sintomas, de ahi su apodo de 'infeccion silenciosa'. Si no se trata, puede causar complicaciones graves como infertilidad.",
                Excerpt = "La clamidia suele ser asintomatica. Por eso es tan importante hacerse pruebas.",
                PublishedAt = new DateTime(2026, 2, 7, 0, 0, 0, DateTimeKind.Utc),
                IsPublished = true,
                ImageUrl = ""
            },
            new()
            {
                Title = "Gonorrea",
                Slug = "gonorrea",
                Category = "informate",
                SubCategory = "its-comunes",
                AuthorName = "Lucia Garcia",
                Content = "La gonorrea es causada por la bacteria Neisseria gonorrhoeae. Puede infectar los genitales, el recto y la garganta. Es tratable con antibioticos, aunque las resistencias a los mismos son un problema creciente de salud publica a nivel mundial.",
                Excerpt = "Causada por la bacteria Neisseria gonorrhoeae. Tratable pero con resistencias crecientes.",
                PublishedAt = new DateTime(2026, 2, 8, 0, 0, 0, DateTimeKind.Utc),
                IsPublished = true,
                ImageUrl = ""
            },
            new()
            {
                Title = "Sifilis",
                Slug = "sifilis",
                Category = "informate",
                SubCategory = "its-comunes",
                AuthorName = "Miguel Torres",
                Content = "La sifilis es una ITS causada por la bacteria Treponema pallidum. Progresa en fases: primaria (chancro), secundaria (erupcion), latente y terciaria. Si se detecta a tiempo, es completamente curable con penicilina.",
                Excerpt = "La sifilis tiene fases distintas. Conocer sus estadios es clave para el tratamiento.",
                PublishedAt = new DateTime(2026, 2, 9, 0, 0, 0, DateTimeKind.Utc),
                IsPublished = true,
                ImageUrl = ""
            },
            new()
            {
                Title = "Por que el porno distorsiona expectativas",
                Slug = "porno-distorsiona-expectativas",
                Category = "realidades",
                SubCategory = "porno-sexualidad",
                AuthorName = "Lucia Garcia",
                Content = "El porno esta en internet, en redes y en muchos moviles. Verlo no te convierte en una mala persona. El problema no es verlo, sino aprender de el. El porno es entretenimiento producido para adultos, no educacion sexual. Genera expectativas irreales sobre los cuerpos, el tiempo, los gemidos y las practicas.",
                Excerpt = "El problema no es ver porno, sino aprender de el.",
                PublishedAt = new DateTime(2026, 2, 10, 0, 0, 0, DateTimeKind.Utc),
                IsPublished = true,
                ImageUrl = ""
            },
            new()
            {
                Title = "Pense que el problema era mi cuerpo",
                Slug = "problema-era-mi-cuerpo",
                Category = "realidades",
                SubCategory = "presion-social",
                AuthorName = "Historia real",
                Content = "Nunca nadie me dijo directamente que mi cuerpo estaba mal. Pero lo senti muchas veces. En los comentarios de otras personas, en las miradas, en las comparaciones constantes con lo que se supone que hay que ser.",
                Excerpt = "Nunca nadie me dijo directamente que mi cuerpo estaba mal. Pero lo senti muchas veces.",
                PublishedAt = new DateTime(2026, 2, 10, 0, 0, 0, DateTimeKind.Utc),
                IsPublished = true,
                ImageUrl = ""
            },
            new()
            {
                Title = "Metodos de barrera: el preservativo",
                Slug = "metodos-barrera-preservativo",
                Category = "cuidate",
                SubCategory = "metodos-barrera",
                AuthorName = "Sara Ibanez",
                Content = "El preservativo masculino (condon) es el metodo mas eficaz para prevenir tanto ITS como embarazos no deseados cuando se usa correctamente. Tiene una eficacia del 98% con uso correcto. El preservativo femenino (femidom) ofrece alternativas y puede ser colocado hasta 8 horas antes de la relacion.",
                Excerpt = "El preservativo sigue siendo el metodo mas eficaz para prevenir tanto ITS como embarazos no deseados.",
                PublishedAt = new DateTime(2026, 2, 12, 0, 0, 0, DateTimeKind.Utc),
                IsPublished = true,
                ImageUrl = ""
            },
            new()
            {
                Title = "PrEP: que es y quien puede acceder",
                Slug = "prep-que-es",
                Category = "cuidate",
                SubCategory = "prep-pep",
                AuthorName = "Javier Ruiz",
                Content = "La Profilaxis Pre-Exposicion (PrEP) es un medicamento que toman personas VIH negativas para prevenir la infeccion. Tiene una eficacia cercana al 99% cuando se toma correctamente. En Espana esta financiado por el Sistema Nacional de Salud para personas con alto riesgo de exposicion al VIH.",
                Excerpt = "La profilaxis pre-exposicion al VIH tiene una eficacia cercana al 99% cuando se toma correctamente.",
                PublishedAt = new DateTime(2026, 5, 5, 0, 0, 0, DateTimeKind.Utc),
                IsPublished = true,
                ImageUrl = ""
            }
        };

        context.Articles.AddRange(articles);
        await context.SaveChangesAsync();
    }
}
