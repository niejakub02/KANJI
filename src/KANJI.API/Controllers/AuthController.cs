using KANJI.Models;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using Google.Apis.Auth;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using KANJI.Data;
using KANJI.Services;
using KANJI.Models.DTO;
using Microsoft.AspNetCore.DataProtection;

namespace KANJI.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private static readonly HttpClient client = new();

        public class Payload
        {
            public string code { get; set; }
        }

        public class Payload2
        {
            public string refreshToken { get; set; }
        }

        public class GoogleResponse
        {
            public string access_token { get; set; }
            public int expires_in { get; set; }
            public string refresh_token { get; set; }
            public string scope { get; set; }
            public string token_type { get; set; }
            public string id_token { get; set; }
        }

        private readonly DataContext dataContext;
        private readonly IAuthService authService;
        private readonly IConfiguration configuration;

        public AuthController(DataContext _dataContext, IAuthService _authService, IConfiguration _configuration)
        {
            dataContext = _dataContext;
            authService = _authService;
            configuration = _configuration;
        }

        //[Authorize]
        [HttpPost("google")]
        public async Task<ActionResult<TokensDTO>> SignIn(Payload payload)
        {
            var tokenPayload = await authService.GetIdToken(payload);

            // sprawdz pod SUB, czy uzytkownik jest w bazie, jak nie to go dodaj i mimo wszystko utworz token
            User? user = await dataContext.Users.FirstOrDefaultAsync(u => u.Sub == tokenPayload.Subject);

            if (user is null)
            {
                // create account
                Console.WriteLine("Create account");
                user = new User
                {
                    Sub = tokenPayload.Subject,
                    Email = tokenPayload.Email,
                    GivenName = tokenPayload.GivenName,
                    Surname = tokenPayload.FamilyName,
                    Picture = tokenPayload.Picture,
                };
                dataContext.Users.Add(user);
                await dataContext.SaveChangesAsync();
            } else
            {
                // do usuniecia, chce tylko sprawdzic else
                Console.WriteLine("User exists");
            }

            // stworz token
            Console.WriteLine(tokenPayload.Email);

            string token = CreateToken(tokenPayload, configuration["TokensSecrets:Access"], 30);
            string refreshToken = CreateToken(tokenPayload, configuration["TokensSecrets:Refresh"], 3600);
            TokensDTO tokens = new()
            {
                AccessToken = token,
                RefreshToken = refreshToken,
            };
            return Ok(tokens);
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<string>> RefreshToken(Payload2 payload)
        {
            var jwt = new JwtSecurityTokenHandler();
            var validationParams = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("2ac898616a21259eba095d450d2794bbdff32819f64e7819a528944bb45917f0d8473a732f9317eb40efc5f41828620c614e252af89825e5a5d51587372f3476")),
                ValidateIssuer = false,
                ValidateAudience = false,
            };

            jwt.ValidateToken(payload.refreshToken, validationParams, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration["TokensSecrets:Access"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var newJwt = new JwtSecurityToken(
                claims: jwtToken.Claims,
                expires: DateTime.Now.AddSeconds(30),
                signingCredentials: creds);

            string token = new JwtSecurityTokenHandler().WriteToken(newJwt);

            return Ok(token);
        }

        public string CreateToken(GoogleJsonWebSignature.Payload payload, string secret, int expiresIn)
        {
            List<Claim> claims =
            [
                new Claim(ClaimTypes.NameIdentifier, payload.Subject),
                new Claim(ClaimTypes.Email, payload.Email),
                new Claim(ClaimTypes.GivenName, payload.GivenName),
                new Claim(ClaimTypes.Surname, payload.FamilyName),

            ];

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var jwt = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddSeconds(expiresIn),
                signingCredentials: creds);

            string token = new JwtSecurityTokenHandler().WriteToken(jwt);

            Console.WriteLine(token);

            return token;
        }
    }
}
