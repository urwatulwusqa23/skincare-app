FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["RoutineService/RoutineService.csproj", "RoutineService/"]
COPY ["Shared/Contracts/Shared.Contracts.csproj", "Shared/Contracts/"]
RUN dotnet restore "RoutineService/RoutineService.csproj"
COPY . .
RUN dotnet publish "RoutineService/RoutineService.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
RUN mkdir -p /app/data
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/routines.db"
EXPOSE 8080
ENTRYPOINT ["dotnet", "RoutineService.dll"]
