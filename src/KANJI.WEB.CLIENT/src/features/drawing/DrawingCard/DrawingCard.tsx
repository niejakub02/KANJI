import { FC, useRef } from 'react';
import './DrawingCard.scss';
import { Canvas } from '@components/Canvas';
import { convertImageToGrayscaleArray } from '@utils/canvasUtils';
import { Button } from 'antd';
import { usePredictMutation } from '@app/api';
import { FunctionOutlined } from '@ant-design/icons';

export const DrawingCard: FC<Partial<HTMLDivElement>> = ({ className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [predict, { data: predictions, isFetching }] = usePredictMutation();

  const onPredict = () => {
    const grayscaleArray = convertImageToGrayscaleArray(ref.current);
    if (!grayscaleArray) return;
    predict(grayscaleArray)
      .unwrap()
      .then((predictions) => {
        console.log(predictions);
      });
  };

  return (
    <div className={`drawing-card ${className}`}>
      <Canvas ref={ref} />
      <Button icon={<FunctionOutlined />} onClick={onPredict}>
        Predict
      </Button>
    </div>
  );
};
