import { convertImageToGrayscaleArray } from '@utils/canvasUtils';
import { Button } from 'antd';
import { usePredictMutation } from '@app/api';
import { DeleteOutlined, FunctionOutlined } from '@ant-design/icons';
import useCanvasControlContext from '@contexts/Canvas.control.context';
import { PredicitonTable } from '@components/PredicitonTable/PredicitonTable';
import './SubOne.scss';

export const SubOne = () => {
  const [predict, { data: predicitons, reset: resetPrediciton }] =
    usePredictMutation({
      fixedCacheKey: 'shared-prediction',
    });
  const { ref, reset: resetCanvas, strokes } = useCanvasControlContext();

  const handleOnPredict = () => {
    const grayscaleArray = convertImageToGrayscaleArray(ref.current);
    if (!grayscaleArray) return;
    predict(grayscaleArray);
  };

  const handleOnReset = () => {
    resetCanvas();
    resetPrediciton();
  };

  return (
    <div className="content-wrapper__sub-one">
      {!strokes && (
        <div className="no-drawing-indicator">
          You haven't drawn
          <br /> anything yet 😿
        </div>
      )}
      {!!predicitons?.length && <PredicitonTable />}

      <div className="buttons-clip">
        <Button
          type="primary"
          shape="round"
          icon={<FunctionOutlined />}
          onClick={handleOnPredict}
          className="predict-button"
          disabled={!strokes}
        >
          Predict
        </Button>
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={handleOnReset}
          disabled={!strokes}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
