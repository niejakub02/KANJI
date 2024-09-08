import { FC, MouseEvent, useCallback, useMemo } from 'react';
import './Header.scss';
import LogoLight from '/logoLight.svg';
import LogoDark from '/logoDark.svg';
import { ThemeSwitch } from '@components/ThemeSwitch';
import { useThemeContext } from '@contexts/Theme.context';
import { Avatar, Dropdown, Input } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useUser } from '@hooks/useUser';

const Header: FC<unknown> = () => {
  const { signOut, user } = useUser();
  const { isDarkMode, setIsDarkMode } = useThemeContext();

  const handleThemeToggle = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      setIsDarkMode((prev) => !prev);
    },
    [setIsDarkMode]
  );

  const items = useMemo<MenuProps['items']>(
    () => [
      {
        key: '1',
        label: <span>Profile</span>,
        disabled: true,
      },
      {
        key: '2',
        label: (
          <div className="theme-switch-wrapper" onClick={handleThemeToggle}>
            <span>Theme</span>
            <ThemeSwitch />
          </div>
        ),
      },
      {
        key: '3',
        danger: true,
        label: 'Sign out',
        onClick: signOut,
      },
    ],
    [handleThemeToggle, signOut]
  );

  return (
    <div className="header">
      <img src={isDarkMode ? LogoDark : LogoLight} className="logo" />

      {/* placeholder */}
      <div></div>

      <Input
        style={{ width: '20%' }}
        placeholder="Search for literals, users etc."
        prefix={<SearchOutlined />}
      />

      {/* placeholder */}
      <div></div>

      <Dropdown
        menu={{
          items,
        }}
      >
        {user?.picture ? (
          <Avatar size={32} src={<img src={user.picture} />} />
        ) : (
          <Avatar size={32} icon={<UserOutlined />} />
        )}
      </Dropdown>
    </div>
  );
};

export default Header;
