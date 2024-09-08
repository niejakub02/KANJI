import { useSupportedKanjiListQuery } from '@app/api';
import { AutoComplete, Button, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { DefaultOptionType } from 'antd/es/select';
import { FC, useMemo, useState } from 'react';

export const SubmissionStep: FC = () => {
  const { data: supportedKanjiList, isFetching } = useSupportedKanjiListQuery();
  //   const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [selected, setSelected] = useState<string>();

  const formattedList: DefaultOptionType[] | undefined = useMemo(
    () =>
      supportedKanjiList?.map((kanji) => ({
        label: kanji,
        value: kanji,
      })),
    [supportedKanjiList]
  );

  return (
    <Spin spinning={isFetching}>
      <div className="submission-step">
        <AutoComplete
          className="submission-step__auto-complete"
          placeholder="Selected kanji 😻"
          size="large"
          options={formattedList}
          //   onInputKeyDown={(e) => setSelected(e.target.value)}
          status={
            !!selected &&
            !formattedList?.map((x) => x.value)?.includes(selected)
              ? 'error'
              : ''
          }
        />
        <TextArea
          className="submission-step__text-area"
          placeholder="Add some comment 😽"
        ></TextArea>
        <Button type="primary" shape="round">
          Submit 😼
        </Button>
      </div>
    </Spin>
  );
};
