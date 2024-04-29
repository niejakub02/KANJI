using KANJI.Models;
using Microsoft.ML.OnnxRuntime;
using Newtonsoft.Json;
using System.Diagnostics;

namespace KANJI.Services
{
    public interface IInferenceService
    {
        public List<Prediction> Predict(float[] arr, int numberOfHighestPredicitons = 10);
    }

    public class InferenceService : IInferenceService
    {
        private readonly IConfiguration configuration;
        private InferenceSession session;

        public InferenceService(IConfiguration _configuration)
        {
            configuration = _configuration;
            session = new InferenceSession(configuration["StaticFiles:ONNXModel"]);
        }

        public List<Prediction> Predict(float[] arr, int numberOfHighestPredicitons = 10)
        {
            using var inputOrtValue = OrtValue.CreateTensorValueFromMemory(arr, [1, 1, 64, 64]);

            var inputs = new Dictionary<string, OrtValue>
            {
                { "input.1", inputOrtValue }
            };

            using var runOptions = new RunOptions();

            using var outputs = session.Run(runOptions, inputs, session.OutputNames);
            //Debug.Assert(outputs.Count > 0, "Expecting some output");

            float[] array = outputs[0].GetTensorDataAsSpan<float>().ToArray();
            float sum = array.Select(MathF.Exp).Sum();

            List<Tuple<int, float>> highestPredicitons = GetHighestPredicitons(array, numberOfHighestPredicitons);
            List<Prediction> predicitons = GetSoftmaxResults(highestPredicitons, sum);

            return predicitons;
        }

        private List<Tuple<int, float>> GetHighestPredicitons(float[] array, int numberOfHighestPredicitons)
        {
            List<Tuple<int, float>> highestPredicitons = [];
            for (int i = 0; i < numberOfHighestPredicitons; i++)
            {
                float highestValue = float.MinValue;
                int highestValueIndex = -1;
                for (int j = 0; j < array.Length; j++)
                {
                    if (array[j] > highestValue)
                    {
                        highestValue = array[j];
                        highestValueIndex = j;
                        array[j] = float.MinValue;
                    }
                }
                highestPredicitons.Add(Tuple.Create(highestValueIndex, highestValue));
            }
            return highestPredicitons;
        }

        private List<Prediction> GetSoftmaxResults(List<Tuple<int, float>> highestPredicitons, float exponentialSum)
        {
            using (StreamReader file = new(configuration["StaticFiles:ClassMapper"]))
            {
                string json = file.ReadToEnd();
                var map = JsonConvert.DeserializeObject<Dictionary<int, string>>(json);
                return highestPredicitons.Select(prediciton => new Prediction
                {
                    literal = map[prediciton.Item1],
                    probability = MathF.Exp(prediciton.Item2) / exponentialSum
                }).ToList();
            }
        }


    }
}
