using Google.Apis.Auth;
using KANJI.Models;
using Microsoft.ML.OnnxRuntime;
using Newtonsoft.Json;
using static KANJI.Controllers.AuthController;

namespace KANJI.Services
{
    public interface IAuthService
    {
        public Task<GoogleJsonWebSignature.Payload> GetIdToken(Payload payload);
    }

    public class AuthService : IAuthService
    {
        private readonly IConfiguration configuration;
        private static readonly HttpClient client = new();

        public AuthService(IConfiguration _configuration)
        {
            configuration = _configuration;
        }

        public async Task<GoogleJsonWebSignature.Payload> GetIdToken(Payload payload)
        {
            var values = new Dictionary<string, string>
            {
                { "code", payload.code },
                { "client_id", "" },
                { "client_secret", "" },
                { "redirect_uri", "http://localhost:3000/auth/google/callback" },
                { "grant_type", "authorization_code" },
            };
            var content = new FormUrlEncodedContent(values);
            var response = await client.PostAsync("https://oauth2.googleapis.com/token", content);
            var responseString = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<GoogleResponse>(responseString);

            var tokenPayload = GoogleJsonWebSignature.ValidateAsync(result.id_token, new GoogleJsonWebSignature.ValidationSettings()).Result;

            return tokenPayload;
        }
    }
}
