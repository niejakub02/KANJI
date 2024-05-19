import { FC } from 'react';
import './SideBar.scss';
import { Anchor } from 'antd';

const SideBar: FC<unknown> = () => {
  return (
    <div className="side-bar">
      <Anchor
        affix={false}
        items={[
          {
            key: '1',
            href: '#1',
            title: 'Draw',
          },
          {
            key: '2',
            href: '#2',
            title: 'Community',
          },
          {
            key: '3',
            href: '#3',
            title: 'Settings',
          },
          {
            key: '4',
            href: '#4',
            title: 'Reports',
          },
        ]}
      />
    </div>
  );
};

export default SideBar;
