import { FC } from 'react';
import './ViewCard.scss';

export const ViewCard: FC<Partial<HTMLDivElement>> = ({ className }) => {
  return (
    <div className={`view-card ${className}`}>
      <div className="view-card--colorized">漢字</div>を書いて予想をしてください ✍️
    </div>
  );
};
