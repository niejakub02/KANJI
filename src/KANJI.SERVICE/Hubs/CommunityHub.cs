using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace KANJI.Hubs
{
    public class Message
    {
        public string EventName { get; set; } = String.Empty;
        public string Content { get; set; } = String.Empty;
    }

    public class CommunityHub : Hub
    {
        private readonly IHttpContextAccessor httpContextAccessor;

        public CommunityHub(IHttpContextAccessor _httpContextAccessor)
        {
            httpContextAccessor = _httpContextAccessor;
        }

        [Authorize]
        public async Task Send(Message message)
        {
            var identity = httpContextAccessor.HttpContext?.User.Identity as ClaimsIdentity;

            if (identity != null)
            {
                var userClaims = identity.Claims;

                Console.WriteLine(userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Email)?.Value);
            }

            await Clients.All.SendAsync(message.EventName, message);
        }
    }
}
