FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore BeNurse.API/BeNurse.API.csproj
RUN dotnet build BeNurse.API/BeNurse.API.csproj -c Release -o /app/build

FROM build AS publish
RUN dotnet publish BeNurse.API/BeNurse.API.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BeNurse.API.dll"]
