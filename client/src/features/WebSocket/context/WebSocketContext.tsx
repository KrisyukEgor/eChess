
import UseWebsocket from "../hooks/useWebsocket";
import { type WebSocketEvent } from "../types/WebSocketTypes/WebSocketTypes";
import { useAuthContext } from "../../auth/context/AuthContext";
import { useContext, createContext } from "react";
import { config } from "../../../config/config";

type WebsocketContextType = ReturnType<typeof UseWebsocket<WebSocketEvent>>;

const WebSocketContext = createContext<WebsocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuthContext();
  const wsUrl = config.wsUrl;

  const websocket = UseWebsocket<WebSocketEvent>(wsUrl, token);

  return (
    <WebSocketContext.Provider value={websocket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error(
      "useWebSocketContext must be used within WebSocketProvider"
    );
  return context;
};
