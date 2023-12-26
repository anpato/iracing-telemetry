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
    if (isOnline) {
      const socket = io('http://127.0.0.1:4210', {
        reconnectionDelay: 1000,
        reconnection: true,
        reconnectionAttempts: 2,
        transports: ['websocket'],
        agent: false,
        upgrade: false,
        rejectUnauthorized: false
      });
      setSocket(socket);
    }

    return () => {
      socket?.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('confirmation', (data) => {
      setConnected(data);
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
