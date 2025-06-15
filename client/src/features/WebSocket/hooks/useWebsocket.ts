import { useRef, useCallback, useEffect, useState } from "react";

export default function UseWebsocket<T = unknown>(url: string, token: string | null) {

    const ws = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const messageQueue = useRef<T[]>([]);
    const listeners = useRef<((data: T) => void)[]>([]);

    const subscribe = useCallback((callback: (data: T) => void) => {
      listeners.current.push(callback);
      return () => {
        listeners.current = listeners.current.filter((l) => l !== callback);
      };
    }, []);

    const send = useCallback(
      (data: T) => {
        if (isConnected && ws.current) {
          try {
            ws.current.send(JSON.stringify(data));
          } catch (error) {
            console.error("WebSocket send error:", error);
          }
        } else {
          messageQueue.current.push(data);
        }
      },
      [isConnected]
    );

    useEffect(() => {
        if(!token) return;

        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            setIsConnected(true);
            
            const messagesToSend = [...messageQueue.current];
            messageQueue.current = [];

            messagesToSend.forEach(msg => {
                ws.current?.send(JSON.stringify(msg));
            })
        }

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data) as T;
                listeners.current.forEach((listener) => {
                    try {
                        listener(data);
                    } catch (error) {
                        console.error('Error in websocket listener:', error);
                    }
                });
            } catch (error) {
                console.error('Error parsing websocket message:', error);
            }
        };

        ws.current.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        ws.current.onclose = () => {
          setIsConnected(false);
        };

        return () => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.close();
          }
        };

    }, [url, token])

    return {
      isConnected,
      send,
      subscribe,
    };
}