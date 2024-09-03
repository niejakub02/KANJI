import { FC, useEffect, useRef, useState } from 'react';
import './SideBar.scss';
import { TabsNavigator } from '@features/global/TabsNavigator/TabsNavigator';
import { Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const SideBar: FC<unknown> = () => {
  const sideBarRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOnClick = (e: MouseEvent) => {
      if (sideBarRef.current && e.target) {
        if (!sideBarRef.current.contains(e.target as Node)) setIsOpen(false);
      }
    };
    setTimeout(() => {
      window.addEventListener('click', handleOnClick);
    }, 0);
    return () => {
      window.removeEventListener('click', handleOnClick);
    };
  }, [isOpen]);

  const handleOnOpen = () => setIsOpen(true);

  console.log(isOpen);
  return (
    <>
      <Button
        icon={<MenuOutlined />}
        type="primary"
        shape="circle"
        size="small"
        id="menu-button"
        onClick={handleOnOpen}
      />
      <div
        className={`side-bar ${isOpen ? 'side-bar--open' : ''}`}
        ref={sideBarRef}
      >
        <TabsNavigator />
      </div>
    </>
  );
};

export default SideBar;
