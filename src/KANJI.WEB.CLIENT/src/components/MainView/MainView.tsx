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
import { ThemeSwitch } from '@components/ThemeSwitch';
import { Button } from 'antd';

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
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          gap: '2rem',
          minWidth: '20rem',
          alignItems: 'center',
        }}
      >
        <ThemeSwitch />
        <SignInButton />
      </div>
      {!user ? null : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <p>{`Hello ${user?.givenName ?? 'there'}!`}</p>
          <p>{`Your email is ${user.email}`}</p>
          {isConnected ? (
            <Button
              onClick={() => {
                connection?.invoke('Send', {
                  eventName: 'msg',
                  content: Math.random().toString(),
                });
              }}
            >
              Send
            </Button>
          ) : (
            <div>Loading...</div>
          )}
          <Canvas ref={ref} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button onClick={onClick}>Predict</Button>
            <Button
              onClick={() => {
                if (ref.current) {
                  ref.current.innerHTML = '';
                }
              }}
            >
              Clear
            </Button>
            <Button onClick={() => ref.current?.lastChild?.remove()}>
              Undo
            </Button>
            <Button
              onClick={() => {
                const getCompoundImage = (fill: boolean = false) => {
                  if (!ref.current) return null;
                  const height = 384;
                  const width = 384;

                  const virtualCanvas = document.createElement('canvas');
                  virtualCanvas.height = height;
                  virtualCanvas.width = width;
                  const virtualCtx = virtualCanvas.getContext('2d');

                  if (!virtualCtx) return null;

                  if (fill) {
                    virtualCtx.fillStyle = 'black';
                    virtualCtx.fillRect(
                      0,
                      0,
                      virtualCanvas.width,
                      virtualCanvas.height
                    );
                  }

                  const atomicCanvas = [
                    ...ref.current.children,
                  ] as HTMLCanvasElement[];

                  for (const canvas of atomicCanvas) {
                    virtualCtx.drawImage(canvas, 0, 0, width, height);
                  }
                  return virtualCanvas;
                };

                const virtualCanvas = getCompoundImage();

                if (!virtualCanvas) return;
                const link = document.createElement('a');
                link.download = `${crypto.randomUUID()}.png`;
                link.href = virtualCanvas.toDataURL();
                link.click();
              }}
            >
              Save
            </Button>
          </div>
          <Button
            onClick={() => {
              removeTokensFromStorage();
            }}
          >
            Sign out
          </Button>
          {/* {localStorage.getItem('refresh_token')?.length && (
        // <button onClick={onRefresh}>Refresh Token</button>
      )} */}
          <Link to="xxx">xxx</Link>
        </div>
      )}
      {!user ? null : (
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
      )}
    </div>
  );
};

export default MainView;
