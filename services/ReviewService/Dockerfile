FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ReviewService/ReviewService.csproj", "ReviewService/"]
COPY ["Shared/Contracts/Shared.Contracts.csproj", "Shared/Contracts/"]
RUN dotnet restore "ReviewService/ReviewService.csproj"
COPY . .
RUN dotnet publish "ReviewService/ReviewService.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
RUN mkdir -p /app/data
EXPOSE 8080
ENTRYPOINT ["dotnet", "ReviewService.dll"]
