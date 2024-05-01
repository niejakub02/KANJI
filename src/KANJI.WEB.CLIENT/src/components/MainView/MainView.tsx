import { Canvas } from '@components/Canvas';
import { FC, useRef } from 'react';
import './MainView.scss';
import { Link } from 'react-router-dom';
import { usePredictMutation } from './../../app/api';
import { useCommunityContext } from './../../contexts/Community.context';
import { convertImageToGrayscaleArray } from '@utils/canvasUtils';
import { useAppSelector } from './../../app/store';
import { SignInButton } from '@components/SignInButton';
import { removeTokensFromStorage } from '@utils/authUtils';

export const MainView: FC<any> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { connection, isConnected } = useCommunityContext();
  const [predict, { data: predicitions, isLoading }] = usePredictMutation();
  const user = useAppSelector((state) => state.auth.user);

  const onClick = () => {
    const grayscaleArray = convertImageToGrayscaleArray(ref.current);
    if (grayscaleArray) predict(grayscaleArray);
  };

  return (
    <div>
      <SignInButton />
      {!user ? (
        <div>sign in first</div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <p>{`Hello ${user?.givenName ?? 'there'}!`}</p>
          <p>{`Your email is ${user.email}`}</p>
          {isConnected ? (
            <button
              onClick={() => {
                connection?.invoke('Send', {
                  eventName: 'msg',
                  content: Math.random().toString(),
                });
              }}
            >
              Send
            </button>
          ) : (
            <div>Loading...</div>
          )}
          <Canvas ref={ref} />
          <div>
            <button onClick={onClick}>Predict</button>
            <button
              onClick={() => {
                if (ref.current) {
                  ref.current.innerHTML = '';
                }
              }}
            >
              Clear
            </button>
            <button onClick={() => ref.current?.lastChild?.remove()}>
              Undo
            </button>
          </div>
          <button
            onClick={() => {
              removeTokensFromStorage();
            }}
          >
            Sign out
          </button>
          {/* {localStorage.getItem('refresh_token')?.length && (
        // <button onClick={onRefresh}>Refresh Token</button>
      )} */}
          <Link to="test">Sing in page</Link>
        </div>
      )}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'column',
          minWidth: '16rem',
        }}
      >
        {isLoading ? (
          <p>loading...</p>
        ) : (
          predicitions?.map((p, i) => (
            <p key={i}>{p.literal + ' - ' + p.probability}</p>
          ))
        )}
      </div>
    </div>
  );
};

export default MainView;
