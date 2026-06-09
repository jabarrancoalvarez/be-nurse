using BeNurse.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BeNurse.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task Initialize(BeNurseDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        await context.Database.ExecuteSqlRawAsync(@"
            ALTER TABLE ""ChatMessages""
            ADD COLUMN IF NOT EXISTS ""IsNurseReply"" boolean NOT NULL DEFAULT false
        ");

        var seed = new List<Article>
        {
            new()
            {
                Title = "Definicion de Infeccion de Transmision Sexual",
                Slug = "definicion-its",
                Category = "informate",
                SubCategory = "definicion",
                AuthorName = "Equipo BE nurse",
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
            },
            new()
            {
                Title = "ChemSex: cuando las drogas y el sexo se mezclan",
                Slug = "chemsex-drogas-y-sexo",
                Category = "realidades",
                SubCategory = "chemsex",
                AuthorName = "Javier Ruiz",
                Content = @"El ChemSex es la practica de consumir sustancias psicoactivas especificas con el objetivo de potenciar, prolongar o facilitar las relaciones sexuales. Las sustancias mas frecuentemente asociadas son la metanfetamina, la mefedrona y el GHB/GBL, aunque tambien puede implicar otras drogas como la ketamina o el poppers.

Aunque puede darse en cualquier persona, el ChemSex esta documentado principalmente en la comunidad de hombres que tienen sexo con hombres (HSH), donde factores como el estigma, la soledad o la busqueda de desinhibicion social pueden actuar como desencadenantes.

Que riesgos tiene?

El ChemSex no es solo un tema de salud sexual. Sus riesgos son multiples:

Riesgos para la salud sexual: bajo los efectos de estas sustancias aumenta la probabilidad de tener relaciones sin proteccion, lo que incrementa el riesgo de transmision de VIH y otras ITS. Ademas, las lesiones genitales pueden pasar desapercibidas por el efecto anestesiante de algunas drogas.

Riesgos de salud mental: el uso continuado puede generar ansiedad, paranoia, depresion y episodios psicoticos, especialmente asociados a la metanfetamina.

Riesgo de sobredosis: el GHB y el GBL tienen un margen de seguridad muy estrecho. Una dosis ligeramente superior a la habitual puede provocar perdida de consciencia, coma o muerte. Combinados con alcohol, el riesgo se multiplica.

Dependencia: aunque no todas las personas que practican ChemSex desarrollan una adiccion, las sustancias implicadas tienen alto potencial adictivo.

Por que cuesta pedir ayuda?

Muchas personas que practican ChemSex no buscan ayuda por miedo al juicio, a la discriminacion o a no ser comprendidas. El estigma que rodea tanto el consumo de drogas como la sexualidad de los colectivos mas afectados dificulta el acceso a recursos sanitarios.

Desde BE nurse queremos que sepas que aqui no hay juicios. Si tienes dudas, si crees que el consumo esta afectando tu vida o si simplemente quieres informarte, puedes escribirnos en el chat anonimo.

Como reducir riesgos?

Si en este momento no puedes o no quieres dejar de consumir, hay medidas que pueden reducir el riesgo:

No mezclar GHB o GBL con alcohol ni otras depresoras del sistema nervioso central.
No consumir solo. Tener a alguien de confianza cerca puede salvar una vida en caso de sobredosis.
Hacerse pruebas de ITS con regularidad, especialmente VIH y hepatitis C.
Usar siempre metodos de barrera (preservativo, dental dam).
Informar a tu medico o enfermero sobre el consumo para recibir atencion sin juicios.

No estas solo o sola. Pedir ayuda es un acto de valentía.",
                Excerpt = "El ChemSex es el uso de sustancias como metanfetamina, mefedrona o GHB para potenciar relaciones sexuales. Entender sus riesgos es clave para tomar decisiones informadas y pedir ayuda sin miedo.",
                PublishedAt = new DateTime(2026, 4, 20, 0, 0, 0, DateTimeKind.Utc),
                IsPublished = true,
                ImageUrl = ""
            }
        };

        var existingSlugs = await context.Articles.Select(a => a.Slug).ToListAsync();
        var newArticles = seed.Where(a => !existingSlugs.Contains(a.Slug)).ToList();

        if (newArticles.Any())
        {
            context.Articles.AddRange(newArticles);
            await context.SaveChangesAsync();
        }
    }
}
