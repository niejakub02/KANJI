import { FC } from 'react';
import './SideBar.scss';
import { TabsNavigator } from '@features/global/TabsNavigator/TabsNavigator';

const SideBar: FC<unknown> = () => {
  return (
    <div className="side-bar">
      <TabsNavigator />
    </div>
  );
};

export default SideBar;
