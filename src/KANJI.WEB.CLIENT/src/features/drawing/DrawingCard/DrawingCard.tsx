import { FC } from 'react';
import './DrawingCard.scss';
import { Canvas } from '@components/Canvas';
import useCanvasControlContext from '@contexts/Canvas.control.context';
import { Spin } from 'antd';
import { usePredictMutation } from '@app/api';

export const DrawingCard: FC<Partial<HTMLDivElement>> = ({ className }) => {
  const [_, { isLoading }] = usePredictMutation({
    fixedCacheKey: 'shared-prediction',
  });
  const { ref, setStrokes } = useCanvasControlContext();

  const handleOnStrokeAdd = () => setStrokes((prev) => prev + 1);

  return (
    <div className={`drawing-card ${className}`}>
      <Spin spinning={isLoading}>
        <Canvas ref={ref} onStrokeAdd={handleOnStrokeAdd} />
      </Spin>
    </div>
  );
};
