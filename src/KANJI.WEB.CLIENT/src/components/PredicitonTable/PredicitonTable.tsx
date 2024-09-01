import { usePredictMutation } from '@app/api';
import './PredicitonTable.scss';
import { Spin } from 'antd';
import { useMemo } from 'react';

export const PredicitonTable = () => {
  const [_, { data: predictions, isLoading }] = usePredictMutation({
    fixedCacheKey: 'shared-prediction',
  });

  const formattedPredicitions = useMemo(
    () =>
      predictions?.map(({ probability, ...rest }) => ({
        ...rest,
        probability: (probability * 100).toFixed(3),
      })),
    [predictions]
  );

  return isLoading ? (
    <Spin />
  ) : (
    <table className="prediction-table">
      <tr>
        <th>Literal</th>
        <th>Probability</th>
      </tr>
      {formattedPredicitions?.map((predicition, index) => (
        //change this key later
        <tr key={index}>
          <td>{predicition.literal}</td>
          <td>{`${predicition.probability} %`}</td>
        </tr>
      ))}
    </table>
  );
};
