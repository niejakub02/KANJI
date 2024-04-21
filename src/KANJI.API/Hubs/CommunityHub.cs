using Microsoft.AspNetCore.SignalR;

namespace KANJI.Hubs
{
    public class Message
    {
        public string EventName { get; set; } = String.Empty;
        public string Content { get; set; } = String.Empty;
    }

    public class CommunityHub : Hub
    {
        public async Task Send(Message message)
        {
            await Clients.All.SendAsync(message.EventName, message);
        }
    }
}
