using System.ComponentModel.DataAnnotations;

namespace KANJI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string Sub {  get; set; } = string.Empty;

        public string GivenName { get; set; } = string.Empty;

        public string Surname { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Picture { get; set; } = string.Empty;
    }
}
