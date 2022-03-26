# IntegrationTestingTool

Web application that allows you to imitate endpoints of server when you have no access.

![use case](./Info/UseCase.gif)

## Getting started

1. Run by docker

* Update url in `server` and `client` section (if you're hosting not on local machine)
* Run `docker-compose up --build --force-recreate`

2. Run by CLI (Kestrel)

* Navigate to `/ServerApp`
* Execute `dotnet run`

3. Run by Visual Studio (IIS)

* Open `/ServerApp/IntegrationTestingTool.sln`
* Run IIS Express profile

1. Setup application config at `.env` file (or keep it the same)
2. Run `docker-compose.yml` file

## Stack

* .NET Core 3.1
* React 16.14
* MongoDB 4.0
* NodeJS 16.14.2
