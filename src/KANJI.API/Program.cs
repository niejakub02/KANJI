using KANJI.Data;
using KANJI.Hubs;
using KANJI.Services;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<DataContext>(
    db => db.UseNpgsql("Server=127.0.0.1;Database=kanji;Port=5432;User Id=kanji_enjoyer;Password=i_luv_kanji_123")
    );
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddSingleton<IInferenceService, InferenceService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
        });
});
builder.Services.AddAuthentication()
    .AddJwtBearer(cfg =>
     {
         cfg.RequireHttpsMetadata = false;
         cfg.SaveToken = true;
         cfg.TokenValidationParameters = new TokenValidationParameters()
         {
             ValidateIssuerSigningKey = true,
             IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["TokensSecrets:Access"])),
             ValidateIssuer = false,
             ValidateAudience = false,
             ClockSkew = TimeSpan.Zero,
         };
     });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
//app.MapHub<CommunityHub>("/community");


app.Run();
