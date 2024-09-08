import { usePredictMutation } from '@app/api';
import './PredicitonTable.scss';
import { Popover } from 'antd';
import { useMemo } from 'react';

export const PredicitonTable = () => {
  const [_, { data: predictions }] = usePredictMutation({
    fixedCacheKey: 'shared-prediction',
  });

  const formattedPredicitions = useMemo(
    () =>
      predictions
        ?.filter((_, i) => i < 8)
        ?.map(({ probability, ...rest }) => ({
          ...rest,
          probability: (probability * 100).toFixed(3),
        })),
    [predictions]
  );

  return (
    <table className="prediction-table">
      <thead>
        <tr>
          <th>Literal</th>
          <th>Probability</th>
        </tr>
      </thead>
      <tbody>
        {formattedPredicitions?.map(({ literal, probability }, index) => (
          //change this key later
          <tr key={index}>
            <Popover
              content={<div className="literal-popover">{literal}</div>}
              trigger="click"
            >
              <td>{literal}</td>
            </Popover>
            <td>{`${probability} %`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
