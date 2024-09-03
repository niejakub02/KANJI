import { FC, useMemo } from 'react';
import './Header.scss';
import LogoLight from '/logoLight.svg';
import LogoDark from '/logoDark.svg';
import { ThemeSwitch } from '@components/ThemeSwitch';
import { useThemeContext } from '@contexts/Theme.context';
import { Avatar, Dropdown, Input } from 'antd';
import { useAppDispatch, useAppSelector } from '@app/store';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { signOut } from '@features/auth/auth.slice';

const Header: FC<unknown> = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const { isDarkMode } = useThemeContext();

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
          <div className="theme-switch-wrapper">
            <span>Theme</span>
            <ThemeSwitch />
          </div>
        ),
      },
      {
        key: '3',
        danger: true,
        label: 'Sign out',
        onClick: () => dispatch(signOut()),
      },
    ],
    [dispatch]
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
