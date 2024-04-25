import { Canvas } from '@components/Canvas';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { FC, useEffect, useRef, useState } from 'react';
import './MainView.scss';

export const MainView: FC<any> = () => {
  const firstRender = useRef<boolean>(true);
  const ref = useRef<HTMLDivElement>(null);
  const [connection, setConnection] = useState<HubConnection>();
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // useEffect(() => {
  //   if (firstRender.current) {
  //     const connection = new HubConnectionBuilder()
  //       .withUrl('https://localhost:7012/community')
  //       .build();

  //     connection.on('msg', ({ eventName, ...rest }) => {
  //       console.warn(`New message on "${eventName}"`);
  //       console.log(rest);
  //     });

  //     connection.start().then(() => setIsConnected(true));
  //     setConnection(connection);
  //   }

  //   firstRender.current = false;
  // }, []);

  const onClick = () => {
    if (!ref.current) return null;
    const height = 64;
    const width = 64;

    const virtualCanvas = document.createElement('canvas');
    virtualCanvas.height = height;
    virtualCanvas.width = width;
    const virtualCtx = virtualCanvas.getContext('2d');

    if (!virtualCtx) return null;

    virtualCtx.fillStyle = 'black';
    virtualCtx.fillRect(0, 0, virtualCanvas.width, virtualCanvas.height);

    const atomicCanvas = [...ref.current.children] as HTMLCanvasElement[];

    for (const canvas of atomicCanvas) {
      virtualCtx.drawImage(canvas, 0, 0, width, height);
    }

    if (!virtualCtx) return;
    const uintarray = virtualCtx.getImageData(0, 0, 64, 64);
    const grayscaleArray = [];

    for (let i = 0; i < uintarray.data.length; i += 4) {
      grayscaleArray.push(
        (0.299 * uintarray.data[i] +
          0.587 * uintarray.data[i + 1] +
          0.114 * uintarray.data[i + 2]) /
          255.0
      );
    }

    fetch('https://localhost:7012/inference/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        content: grayscaleArray,
      }),
    }).then((res: any) => res.json().then((data: any) => console.log(data)));
  };

  const onRefresh = () => {
    fetch('https://localhost:7012/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        refreshToken: localStorage.getItem('refresh_token'),
      }),
    }).then((res: any) =>
      res.text().then((data: any) => localStorage.setItem('access_token', data))
    );
  };

  return (
    <div>
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
      <button onClick={onClick}>Predict</button>
      <button onClick={onRefresh}>Refresh Token</button>
    </div>
  );
};

export default MainView;
