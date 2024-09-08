import { ActionCard } from '@features/drawing/ActionCard/ActionCard';
import { DrawingCard } from '@features/drawing/DrawingCard/DrawingCard';
import { ViewCard } from '@features/global/ViewCard/ViewCard';
import { FC } from 'react';

export const DrawSubpage: FC = () => {
  return (
    <div className="content-wrapper">
      <ViewCard className="content-wrapper__top" />
      <DrawingCard className="content-wrapper__main" />
      <ActionCard className="content-wrapper__sub-one" />
    </div>
  );
};

export default DrawSubpage;
