import { FC, ReactNode, createContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export type SocketContext = {
  socket: Socket | null;
  isConnected: boolean;
  toggleConnection: (value: boolean) => void;
};

export const SocketContext = createContext<SocketContext>({
  socket: null,
  isConnected: false,
  toggleConnection: () => {}
});

const SocketProvider: FC<{ children: ReactNode; isOnline: boolean }> = ({
  children,
  isOnline
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setConnected] = useState<boolean>(isOnline);
  useEffect(() => {
    // if (isOnline) {
    const socket = io('https://a67f-70-21-167-86.ngrok-free.app/', {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 2,
      transports: ['websocket'],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false
    });
    setSocket(socket);
    // }

    return () => {
      socket?.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('confirmation', (data) => {
      setConnected(data);
    });
    // socket?.on('session', (data) => {
    //   console.log(data);
    //   // setSession()
    // });
    socket?.on('telemetry', (data) => {
      console.log('Telemetr', data);
      // setSession()
    });
  }, [socket]);

  useEffect(() => {
    if (socket?.disconnected) {
      setConnected(false);
    }
  }, [socket?.disconnected]);

  const toggleConnection = (value: boolean): void => {
    setConnected(value);
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, toggleConnection }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
