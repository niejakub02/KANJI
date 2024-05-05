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
using System.Data;

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
        private readonly IHttpContextAccessor httpContextAccessor;

        public AuthController(DataContext _dataContext, IAuthService _authService, IConfiguration _configuration, IHttpContextAccessor _httpContextAccessor)
        {
            dataContext = _dataContext;
            authService = _authService;
            configuration = _configuration;
            httpContextAccessor = _httpContextAccessor;
        }

        [HttpGet("sign-in/google")]
        public async Task<ActionResult<TokensDTO>> SignIn([FromQuery] string code)
        {
            var tokenPayload = await authService.GetIdToken(code);
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
            string token = authService.CreateToken(tokenPayload, configuration["TokensSecrets:Access"], 30);
            string refreshToken = authService.CreateToken(tokenPayload, configuration["TokensSecrets:Refresh"], 3600);
            TokensDTO tokens = new()
            {
                AccessToken = token,
                RefreshToken = refreshToken,
            };
            return Ok(tokens);
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<TokensDTO>> RefreshToken(Payload2 payload)
        {
            try
            {
            var jwt = new JwtSecurityTokenHandler();
            var validationParams = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration["TokensSecrets:Refresh"])),
                ValidateIssuer = false,
                ValidateAudience = false,
            };
                jwt.ValidateToken(payload.refreshToken, validationParams, out SecurityToken validatedToken);
                var jwtToken = (JwtSecurityToken)validatedToken;
                string token = authService.CreateToken(jwtToken.Claims, configuration["TokensSecrets:Access"], 30);
                string refreshToken = authService.CreateToken(jwtToken.Claims, configuration["TokensSecrets:Refresh"], 3600);
                TokensDTO tokens = new()
                {
                    AccessToken = token,
                    RefreshToken = refreshToken,
                };
                return Ok(tokens);
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize]
        [HttpGet("user-details")]
        public async Task<ActionResult<UserDetails>> GetUserDetails()
        {
            var identity = httpContextAccessor.HttpContext.User.Identity as ClaimsIdentity;

            if (identity != null)
            {
                var userClaims = identity.Claims;

                return new UserDetails
                {
                    Sub = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)?.Value,
                    Email = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Email)?.Value,
                    GivenName = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.GivenName)?.Value,
                    Surname = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Surname)?.Value,
                };
            }
            return Ok(null);
        }
    }
}
