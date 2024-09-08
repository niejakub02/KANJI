import { useAppSelector } from '@app/store';
import {
  signIn as signInAction,
  signOut as signOutAction,
} from '@features/auth/auth.slice';
import { selectTab } from '@features/global/global.slice';
import { User } from '@utils/types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const useUser = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signOut = () => {
    navigate('/');
    dispatch(selectTab('draw'));
    dispatch(signOutAction());
  };

  const signIn = (userDetails: User) => dispatch(signInAction(userDetails));

  return {
    user,
    signOut,
    signIn,
  };
};
