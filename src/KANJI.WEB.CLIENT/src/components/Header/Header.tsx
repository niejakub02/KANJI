import { FC } from 'react';
import './Header.scss';
import LogoLight from '/logoLight.svg';
import LogoDark from '/logoDark.svg';
import { ThemeSwitch } from '@components/ThemeSwitch';
import { useThemeContext } from '@contexts/Theme.context';
import { Avatar, Input } from 'antd';
import { useAppSelector } from '@app/store';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';

const Header: FC<unknown> = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { isDarkMode } = useThemeContext();

  return (
    <div className="header">
      <img
        src={isDarkMode ? LogoDark : LogoLight}
        className="logo"
        alt="Vite logo"
      />
      <ThemeSwitch />
      <Input
        style={{ width: '20%' }}
        placeholder="Search for literals, users etc."
        prefix={<SearchOutlined />}
      />
      {user?.picture ? (
        <Avatar size={32} src={<img src={user.picture} />} />
      ) : (
        <Avatar size={32} icon={<UserOutlined />} />
      )}
      <div></div>
    </div>
  );
};

export default Header;
