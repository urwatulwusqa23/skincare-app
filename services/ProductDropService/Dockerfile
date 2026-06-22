FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ProductDropService/ProductDropService.csproj", "ProductDropService/"]
COPY ["Shared/Contracts/Shared.Contracts.csproj", "Shared/Contracts/"]
RUN dotnet restore "ProductDropService/ProductDropService.csproj"
COPY . .
RUN dotnet publish "ProductDropService/ProductDropService.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
RUN mkdir -p /app/data
EXPOSE 8080
ENTRYPOINT ["dotnet", "ProductDropService.dll"]
