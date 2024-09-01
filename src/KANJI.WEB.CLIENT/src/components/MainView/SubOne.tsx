import { convertImageToGrayscaleArray } from '@utils/canvasUtils';
import { Button } from 'antd';
import { usePredictMutation } from '@app/api';
import { DeleteOutlined, FunctionOutlined } from '@ant-design/icons';
import useCanvasControlContext from '@contexts/Canvas.control.context';
import { PredicitonTable } from '@components/PredicitonTable/PredicitonTable';
import './SubOne.scss';

export const SubOne = () => {
  const [predict, { reset: resetPrediciton }] = usePredictMutation({
    fixedCacheKey: 'shared-prediction',
  });
  const { ref, reset: resetCanvas } = useCanvasControlContext();

  const handleOnPredict = () => {
    const grayscaleArray = convertImageToGrayscaleArray(ref.current);
    if (!grayscaleArray) return;
    predict(grayscaleArray)
      .unwrap()
      .then((predictions) => {
        console.log(predictions);
      });
  };

  const handleOnReset = () => {
    resetCanvas();
    resetPrediciton();
  };

  return (
    <div className="content-wrapper__sub-one">
      <PredicitonTable />
      <div className="buttons-clip">
        <Button
          type="primary"
          shape="round"
          icon={<FunctionOutlined />}
          onClick={handleOnPredict}
          className="predict-button"
        >
          Predict
        </Button>
        <Button type="text" icon={<DeleteOutlined />} onClick={handleOnReset}>
          Clear
        </Button>
      </div>
    </div>
  );
};
