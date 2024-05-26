import { CSSProperties, FC, useCallback, useMemo } from 'react';
import './TabsNavigator.scss';
import { Tab, selectTab } from '../global.slice';
import { useAppDispatch, useAppSelector } from '@app/store';
import DrawIcon from '/draw.svg';
import CommunityIcon from '/community.svg';
import SettingsIcon from '/settings.svg';
import ReportsIcon from '/reports.svg';

const tabs: Tab[] = ['draw', 'community', 'settings', 'reports'];
const tabsIcons = [DrawIcon, CommunityIcon, SettingsIcon, ReportsIcon];

export const TabsNavigator: FC = () => {
  const { selectedTab } = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();

  const navigatorProps = useMemo(
    () =>
      ({
        '--selected-tab': tabs.findIndex((tab) => tab === selectedTab) ?? 0,
        '--tabs': tabs.length,
      } as CSSProperties),
    [selectedTab]
  );

  const iconProps = useCallback(
    (index: number) =>
      ({ '--src': `url(${tabsIcons[index]})` } as CSSProperties),
    []
  );

  return (
    <div className="tabs-navigator" style={navigatorProps}>
      {tabs.map((tab, index) => (
        <div
          key={tab}
          className="tabs-navigator__tab"
          data-selected={selectedTab === tab ? '' : undefined}
          onClick={() => dispatch(selectTab(tab))}
        >
          <div className="icon" style={iconProps(index)}></div>
          {tab.at(0)?.toUpperCase() + tab.slice(1)}
        </div>
      ))}
    </div>
  );
};
