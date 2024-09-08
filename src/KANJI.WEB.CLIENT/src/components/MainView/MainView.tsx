import { FC, useEffect } from 'react';
import './MainView.scss';
import { useAppDispatch, useAppSelector } from './../../app/store';
import { SignInButton } from '@components/SignInButton';
import { Header } from '@components/Header';
import { SideBar } from '@components/SideBar';
import { useThemeContext } from '@contexts/Theme.context';
import { Outlet, useNavigate } from 'react-router-dom';
import { selectTab } from '@features/global/global.slice';

export const MainView: FC<any> = () => {
  // const { connection, isConnected } = useCommunityContext();
  const user = useAppSelector((state) => state.auth.user);
  const { isDarkMode } = useThemeContext();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user && window.location.pathname === '/') {
      navigate('draw');
      dispatch(selectTab('draw'));
    }
  }, [dispatch, navigate, user]);

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
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainView;
