import { DeleteOutlined, FunctionOutlined } from '@ant-design/icons';
import { usePredictMutation } from '@app/api';
import { PredicitonTable } from '@components/PredicitonTable/PredicitonTable';
import useCanvasControlContext from '@contexts/Canvas.control.context';
import { convertImageToGrayscaleArray } from '@utils/canvasUtils';
import { Button, Spin } from 'antd';
import { FC } from 'react';

export const PredicitonStep: FC = () => {
  const [predict, { data: predicitons, reset: resetPrediciton, isLoading }] =
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
    <Spin spinning={isLoading}>
      <div className="prediciton-step">
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
    </Spin>
  );
};
