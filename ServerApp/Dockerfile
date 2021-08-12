FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app
COPY . ./
RUN dotnet restore "./IntegrationTestingTool.csproj"
RUN dotnet publish "IntegrationTestingTool.csproj" -c Release -o out
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 as runtime
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "IntegrationTestingTool.dll"]