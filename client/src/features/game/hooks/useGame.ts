// import { useEffect, useState, useCallback } from "react";
// import { useWebSocketContext } from "../../WebSocket/context/WebSocketContext";
// import { MoveMadePayload, GameEvent } from "../types/GameEvent";
// import { type Player } from "../../../shared/types/Player";
// import { type WebSocketEvent } from "../../WebSocket/types/WebSocketTypes";

// export function useGame() {
//   const [moveMade, setMoveMade] = useState<MoveMadePayload | null>(null);
//   const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

//   const { isConnected, send, subscribe } = useWebSocketContext();

//   useEffect(() => {
//     const unsubscribe = subscribe((event: WebSocketEvent) => {
//       switch (event.type) {
//         case "MOVE_MADE":
//           console.log("get move", event.payload);
//           setMoveMade(event.payload);
//           break;

//         default:
//           break;
//       }
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, [subscribe]);

//   const sendMove = useCallback(
//     (payload: MoveMadePayload) => {
//       if (!isConnected) {
//         console.warn(
//           "WebSocket не подключён, ход поставлен в очередь или проигнорирован"
//         );
//         return;
//       }
//       console.log("move send", payload);
//       const event: GameEvent = {
//         type: "MAKE_MOVE",
//         payload: payload,
//       };
//       send(event);
//     },
//     [isConnected, send]
//   );

//   return {
//     moveMade,
//     currentPlayer,
//     setCurrentPlayer,
//     sendMove,
//   };
// }
