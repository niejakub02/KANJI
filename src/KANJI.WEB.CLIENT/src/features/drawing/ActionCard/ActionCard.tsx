import { StepProps, Steps } from 'antd';
import './ActionCard.scss';
import { FC, useMemo, useState } from 'react';
import { PredicitonStep } from './Steps/PredicitonStep';
import { SubmissionStep } from './Steps/SubmissionStep';
import useCanvasControlContext from '@contexts/Canvas.control.context';
import { useThemeContext } from '@contexts/Theme.context';

enum Step {
  Prediction,
  Submission,
}

export const ActionCard: FC<Partial<HTMLDivElement>> = ({ className }) => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Prediction);
  const { strokes } = useCanvasControlContext();
  const { isDarkMode } = useThemeContext();

  const handleStepChange = (step: Step) => {
    setCurrentStep(step);
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 0);
  };
  const items: StepProps[] = useMemo(
    () => [
      {
        title: 'Prediction',
        onClick: () => handleStepChange(Step.Prediction),
      },
      {
        title: 'Submission',
        onClick: () => handleStepChange(Step.Submission),
        disabled: true,
        description: !strokes ? 'Please draw a kanji first 🙀' : '',
      },
    ],
    [strokes]
  );

  return (
    <div className={`action-card ${className}`}>
      {currentStep === Step.Prediction && <PredicitonStep />}
      {currentStep === Step.Submission && <SubmissionStep />}
      <Steps
        items={items}
        type="inline"
        current={currentStep}
        className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}
      ></Steps>
    </div>
  );
};
