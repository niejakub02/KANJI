namespace KANJI.Models
{
    public class Prediction
    {
        public string literal { get; set; }
        public float probability { get; set; }

        //public Prediction(Tuple<int, float> tuple)
        //{
        //    literal = tuple.Item1;
        //    probability = tuple.Item2;
        //}
    }
}
