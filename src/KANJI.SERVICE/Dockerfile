FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src
COPY ["./KANJI.csproj", "KANJI.SERVICE/"]
RUN dotnet restore "KANJI.SERVICE/KANJI.csproj"
WORKDIR "/src/KANJI.SERVICE"
COPY . .
RUN dotnet build "KANJI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "KANJI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=build /src/KANJI.SERVICE/model_3_8.onnx .
ENTRYPOINT ["dotnet", "KANJI.dll"]