using KANJI.Models;
using KANJI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using Newtonsoft.Json;


//using System.Numerics.Tensors
using System.Diagnostics;

namespace KANJI.Controllers
{
    public class Image
    {
        public float[] content { get; set; }
    }

    [ApiController]
    [Route("inference")]
    public class InferenceController : ControllerBase
    {
        private readonly IInferenceService inference;

        public InferenceController(IInferenceService _inference)
        {
            inference = _inference;
        }

        [Authorize]
        [HttpPost("predict")]
        public List<Prediction> Predict(Image img)
        {
            return inference.Predict(img.content);
        }
    }
}
