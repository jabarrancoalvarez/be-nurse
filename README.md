# be-nurse

Plataforma de salud sexual respaldada por profesionales de enfermeria. Conecta pacientes con enfermeros/as especializados/as.

## Requisitos previos

- Node.js 20+
- .NET SDK 9
- Docker Desktop

## Levantar con Docker (recomendado)

```bash
docker-compose up --build
```

## Desarrollo local

### Base de datos

```bash
docker-compose up postgres -d
```

### API Backend

```bash
cd backend
dotnet run --project BeNurse.API
```

### Frontend Angular

```bash
cd frontend
npm install
ng serve
```

## URLs

| Servicio | URL |
|---|---|
| Frontend | http://localhost:4200 |
| API | http://localhost:5000 |
| Swagger | http://localhost:5000/swagger |

## Migraciones EF Core

```bash
dotnet ef migrations add InitialCreate --project backend/BeNurse.Infrastructure --startup-project backend/BeNurse.API
dotnet ef database update --project backend/BeNurse.Infrastructure --startup-project backend/BeNurse.API
```

## Stack

- **Frontend**: Angular 21 (standalone components, signals)
- **Backend**: .NET 9 Web API (Clean Architecture)
- **Base de datos**: PostgreSQL 16
- **ORM**: Entity Framework Core 9 + Npgsql
