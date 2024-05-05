import { MoonFilled, SunFilled } from '@ant-design/icons';
import { useThemeContext } from '@contexts/Theme.context';
import { Switch } from 'antd';
import { FC } from 'react';

const ThemeSwitch: FC<unknown> = () => {
  const { isDarkMode, setIsDarkMode, messageApi } = useThemeContext();

  return (
    <Switch
      checked={isDarkMode}
      onChange={() => {
        messageApi?.info('mode changed!');
        setIsDarkMode((prev) => !prev);
      }}
      checkedChildren={<MoonFilled />}
      unCheckedChildren={<SunFilled />}
    />
  );
};

export default ThemeSwitch;
