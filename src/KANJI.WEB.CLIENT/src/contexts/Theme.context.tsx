import { ConfigProvider, theme, App as AntdApp, message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { AliasToken } from 'antd/es/theme/internal';
import { ReactNode, FC, useState, createContext, useContext } from 'react';

type ThemeProviderProps = {
  children: ReactNode;
};

type ThemeContext = {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean | ((previous: boolean) => boolean)) => void;
  messageApi?: MessageInstance;
};

const initalState: ThemeContext = {
  isDarkMode: true,
  setIsDarkMode: () => {},
  messageApi: undefined,
};

const themeContext = createContext<ThemeContext>(initalState);

const lightTheme: Partial<AliasToken> = {
  colorBgContainer: '#F2F3F7',
  colorBgLayout: '#D7D9E1',
};

const darkTheme: Partial<AliasToken> = {
  colorBgLayout: '#0d0d0d',
};

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(initalState.isDarkMode);
  const { defaultAlgorithm, darkAlgorithm } = theme;
  // const { defaultAlgorithm, darkAlgorithm, useToken } = theme;
  const [messageApi, contextHolder] = message.useMessage();
  // const { token } = useToken();

  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: isDarkMode ? darkTheme : lightTheme,
      }}
    >
      <themeContext.Provider value={{ isDarkMode, setIsDarkMode, messageApi }}>
        {contextHolder}
        <AntdApp className={isDarkMode ? 'dark' : 'light'}>{children}</AntdApp>
      </themeContext.Provider>
    </ConfigProvider>
  );
};

export const useThemeContext = () => useContext(themeContext);

export default ThemeProvider;
