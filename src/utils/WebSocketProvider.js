import React, { createContext, useContext, useState } from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);

  const connectWebSocket = () => {
    const socket = new SockJS('/websocket');
    setStompClient(Stomp.over(socket));
    console.log("WebSocket Connected");
  };

  const disconnectWebSocket = () => {
    // WebSocket 연결 해제 로직
    if (stompClient !== null) {
      stompClient.disconnect();
      setStompClient(null);
      console.log("WebSocket Disconnected");
    }
  };

  const contextValue = {
    connectWebSocket,
    disconnectWebSocket,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
