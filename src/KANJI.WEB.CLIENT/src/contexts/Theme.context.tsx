import { ConfigProvider, theme, App as AntdApp, message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
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
        // token: {
        //   colorBgContainer: isDarkMode ? 'violet' : token.colorBgContainer,
        // },
      }}
    >
      <themeContext.Provider value={{ isDarkMode, setIsDarkMode, messageApi }}>
        {contextHolder}
        <AntdApp>{children}</AntdApp>
      </themeContext.Provider>
    </ConfigProvider>
  );
};

export const useThemeContext = () => useContext(themeContext);

export default ThemeProvider;
