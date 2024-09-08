import { FC, useEffect, useRef, useState } from 'react';
import './SideBar.scss';
import { TabsNavigator } from '@features/global/TabsNavigator/TabsNavigator';
import { Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const SideBar: FC<unknown> = () => {
  const sideBarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tabsNavigatorRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOnClick = (e: MouseEvent) => {
      if (tabsNavigatorRef.current && buttonRef.current && e.target) {
        if (
          !tabsNavigatorRef.current.contains(e.target as Node) &&
          !buttonRef.current.contains(e.target as Node)
        )
          setIsOpen(false);
      }
    };
    window.addEventListener('click', handleOnClick);
    return () => {
      window.removeEventListener('click', handleOnClick);
    };
  }, [isOpen]);

  const handleOnOpen = () => setIsOpen(true);

  return (
    <>
      <Button
        icon={<MenuOutlined />}
        type="primary"
        shape="circle"
        size="small"
        id="menu-button"
        ref={buttonRef}
        onClick={handleOnOpen}
      />
      <div
        className={`side-bar ${isOpen ? 'side-bar--open' : ''}`}
        ref={sideBarRef}
      >
        <TabsNavigator ref={tabsNavigatorRef} />
      </div>
    </>
  );
};

export default SideBar;
