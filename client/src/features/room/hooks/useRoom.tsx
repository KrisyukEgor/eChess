import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../../auth/context/AuthContext";
import { useWebSocketContext } from "../../WebSocket/context/WebSocketContext";

import { type Player } from "../../../shared/types/Player";
import { type WebSocketEvent } from "../../WebSocket/types/WebSocketTypes";
import { Color } from "../../../../chess/src/Core/Enums/Color";
import { config } from "../../../config/config";


const ROOM_STORAGE = "roomId"
export function useRoom() {
  const { user } = useAuthContext();
  const { isConnected, send, subscribe } = useWebSocketContext();

  const [roomId, setRoomId] = useState<string | null>(() => localStorage.getItem(ROOM_STORAGE));
  const [players, setPlayers] = useState<Player[]>([]);
  const [roomError, setRoomError] = useState<string | null>(null);

  useEffect(() => {
    console.log("useRoom: setting up WebSocket subscription");

    const unsubscribe = subscribe((event: WebSocketEvent) => {
      console.log("useRoom: WebSocket event received:", event);

      switch (event.type) {
        case "ROOM_CREATED": {
          console.log("useRoom: ROOM CREATED, payload:", event.payload);
          setRoomError(null);

          const createdPlayer: Player = {
            id: event.payload.player.id, 
            userName: event.payload.player.userName,
            color: event.payload.player.color as Color
          };

          setRoomId(event.payload.roomId);
          setPlayers([createdPlayer]);

          localStorage.setItem(ROOM_STORAGE, event.payload.roomId);
          break;
        }

        case "PLAYER_JOINED":
          console.log("useRoom: PLAYER_JOINED, payload:", event.payload);
          setPlayers((prev) => {
            const exists = prev.some((p) => p.id === event.payload.player.id);
            return exists ? prev : [...prev, event.payload.player];
          });
          break;

        case "PLAYER_LEFT":
          console.log("useRoom: Player_left, payload:", event.payload);

          setPlayers((prev) => {
            return prev.filter((p) => p.id !== event.payload.userId);
          });
          localStorage.removeItem(ROOM_STORAGE);
          break;

        case "ROOM_ERROR":
          console.log("useRoom: ROOM_ERROR, message:", event.payload.message);
          setRoomError(event.payload.message);
          break;
      }
    });
    return () => {
      console.log("useRoom: cleaning up WebSocket subscription");
      unsubscribe();
    };
  }, [subscribe]);

  useEffect(() => {

    if (!roomId) {
      setPlayers([]);
      return;
    }

    let isMounted = true;
    const url = `${config.apiUrl}/rooms/${roomId}/players`;

    fetch(url, { method: "GET" })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || response.statusText);
          });
        }
        return response.json();
      })
      .then((data: { players: Player[] }) => {
        if (isMounted) {
          setPlayers(data.players);
          setRoomError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setRoomError(err.message || "Failed to load players");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [roomId]);
  
  const createRoom = useCallback(() => {
    if (!isConnected) {
      setRoomError("Сервер не подключён");
      return;
    }
    if (!user) {
      setRoomError("Пользователь не авторизован");
      return;
    }

    setRoomError(null);

    console.log(user);

    send({
      type: "CREATE_ROOM",
      payload: {
        userId: user.id,
        userName: user.userName,
        color: Color.WHITE
      },
    });
  }, [isConnected, user, send]);

  const joinRoom = useCallback(
    (roomToJoin: string) => {
      if (!isConnected) {
        setRoomError("Сервер не подключён");
        return;
      }

      if (!user) {
        setRoomError("Пользователь не авторизован");
        return;
      }
      if (!roomToJoin.trim()) {
        setRoomError("Неверный ID комнаты");
        return;
      }
      setRoomError(null);
      send({
        type: "JOIN_ROOM",
        payload: {
          roomId: roomToJoin.trim(),
          userId: user.id,
          userName: user.userName,
        },
      });
    },
    [isConnected, user, send]
  );

  const leaveRoom = useCallback(() => {
    if (!roomId || !user) return;

    console.log("useRoom: leaving room", roomId);

    localStorage.removeItem(ROOM_STORAGE);
    setRoomId(null);
    setPlayers([]);
    setRoomError(null);
    send({ type: "LEAVE_ROOM", payload: { roomId, userId: user.id } });
  }, [roomId, user, send]);

  return {
    roomId,
    players,
    roomError,
    createRoom,
    joinRoom,
    leaveRoom,
  };
}
