import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type ComunnityContextProps = {
  children: ReactNode;
};

type CommunityContext = {
  connection: HubConnection | null;
  isConnected: boolean;
};

const initalState: CommunityContext = {
  connection: null,
  isConnected: false,
};

const communityContext = createContext<CommunityContext>(initalState);

export const CommunityContextProvider: FC<ComunnityContextProps> = ({
  children,
}) => {
  const firstRender = useRef<boolean>(true);
  const [connection, setConnection] = useState<HubConnection | null>(
    initalState.connection
  );
  const [isConnected, setIsConnected] = useState<boolean>(
    initalState.isConnected
  );

  useEffect(() => {
    if (firstRender.current) {
      buildConnection();
    }
    firstRender.current = false;
    return () => {
      connection?.stop();
      setIsConnected(false);
    };
  }, [connection]);

  const buildConnection = () => {
    const connection = new HubConnectionBuilder()
      .withUrl('http://localhost:5059/community', {
        accessTokenFactory: () => localStorage.getItem('access_token') ?? '',
      })
      .build();

    connection.on('msg', ({ eventName, ...rest }) => {
      console.warn(`New message on "${eventName}"`);
      console.log(rest);
    });

    connection
      .start()
      .then(() => setIsConnected(true))
      .catch(() => setIsConnected(false));

    setConnection(connection);
  };

  return (
    <communityContext.Provider value={{ connection, isConnected }}>
      {children}
    </communityContext.Provider>
  );
};

export const useCommunityContext = () => useContext(communityContext);

export default CommunityContextProvider;
