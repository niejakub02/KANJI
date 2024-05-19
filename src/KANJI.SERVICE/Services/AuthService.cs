using Google.Apis.Auth;
using KANJI.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.ML.OnnxRuntime;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using static KANJI.Controllers.AuthController;

namespace KANJI.Services
{
    public interface IAuthService
    {
        public Task<GoogleJsonWebSignature.Payload> GetIdToken(string code);
        public string CreateToken(GoogleJsonWebSignature.Payload payload, string secret, int expiresIn);
        public string CreateToken(IEnumerable<Claim> claims, string secret, int expiresIn);
    }

    public class AuthService : IAuthService
    {
        private readonly IConfiguration configuration;
        private static readonly HttpClient client = new();

        public AuthService(IConfiguration _configuration)
        {
            configuration = _configuration;
        }

        public async Task<GoogleJsonWebSignature.Payload> GetIdToken(string code)
        {
            var values = new Dictionary<string, string>
            {
                { "code", code },
                { "client_id", configuration["GoogleOAUTH:ClientId"] },
                { "client_secret", configuration["GoogleOAUTH:ClientSecret"] },
                { "redirect_uri", configuration["GoogleOAUTH:RedirectUri"] },
                { "grant_type", "authorization_code" },
            };
            var content = new FormUrlEncodedContent(values);
            var response = await client.PostAsync("https://oauth2.googleapis.com/token", content);
            var responseString = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<GoogleResponse>(responseString);

            var tokenPayload = GoogleJsonWebSignature.ValidateAsync(result.id_token, new GoogleJsonWebSignature.ValidationSettings()).Result;

            return tokenPayload;
        }

        public string CreateToken(GoogleJsonWebSignature.Payload payload, string secret, int expiresIn)
        {
            List<Claim> claims =
            [
                new Claim(ClaimTypes.NameIdentifier, payload.Subject),
                new Claim(ClaimTypes.Email, payload.Email),
                new Claim(ClaimTypes.GivenName, payload?.GivenName ?? String.Empty),
                new Claim(ClaimTypes.Surname, payload?.FamilyName ?? String.Empty),
                new Claim(ClaimTypes.Uri, payload?.Picture ?? String.Empty)
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

        public string CreateToken(IEnumerable<Claim> claims, string secret, int expiresIn)
        {
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
