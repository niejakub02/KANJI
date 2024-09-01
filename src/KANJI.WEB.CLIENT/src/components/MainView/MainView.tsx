import { FC } from 'react';
import './MainView.scss';
import { useAppSelector } from './../../app/store';
import { SignInButton } from '@components/SignInButton';
import { Header } from '@components/Header';
import { SideBar } from '@components/SideBar';
import { DrawingCard } from '@features/drawing/DrawingCard/DrawingCard';
import { ViewCard } from '@features/global/ViewCard/ViewCard';
import { SubOne } from './SubOne';
import { useThemeContext } from '@contexts/Theme.context';

export const MainView: FC<any> = () => {
  // const { connection, isConnected } = useCommunityContext();
  const user = useAppSelector((state) => state.auth.user);
  const selectedTab = useAppSelector((state) => state.global.selectedTab);
  const { isDarkMode } = useThemeContext();

  console.log(user);
  return (
    <div>
      {!user ? (
        <SignInButton />
      ) : (
        <div className="workarea">
          <Header />
          <SideBar />
          <div
            className={`workarea__content ${
              isDarkMode ? 'workarea__content--dark' : ''
            }`}
          >
            {selectedTab === 'draw' ? (
              <div className="content-wrapper">
                <ViewCard className="content-wrapper__top" />
                <DrawingCard className="content-wrapper__main" />
                <SubOne />
              </div>
            ) : (
              <h2>hello</h2>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainView;
