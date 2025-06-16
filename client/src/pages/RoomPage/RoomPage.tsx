import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../features/auth/context/AuthContext";
import { useRoomContext } from "../../features/room/context/RoomContext";
import styles from "./RoomPage.module.css";
import { RoutesEnum } from "../../shared/utils/RoutesEnum";
import { useFetch } from "../../shared/hooks/useFetch";

export const RoomPage: React.FC = () => {
  const { roomId: paramRoomId } = useParams<{ roomId: string }>();
//   const { setCurrentPlayer } = useGameContext();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { roomId, players, roomError, joinRoom, leaveRoom } = useRoomContext();
  
  useEffect(() => {
    if (roomError) {
      alert(roomError);
    }
  }, [roomError, navigate]);

  useEffect(() => {
    console.log("players modified", players)
  },[players]);

//   useEffect(() => {
//     if (roomId === paramRoomId && players.length === 2) {
//       const player = players.find((p) => p?.id === user?.id);

//       if (player) {
//         // setCurrentPlayer(player);
//         navigate(`${RoutesEnum.GameRoute}/${paramRoomId}`, { replace: true });
//       }
//     }

//     console.log("players", players);

//   }, [roomId, paramRoomId, players, navigate, user]);

  const handleLeave = () => {
    navigate(`${RoutesEnum.HomeRoute}`, { replace: true });
    leaveRoom();
  };

  if (!paramRoomId || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.waitingRoom}>
        <h2>Комната ожидания</h2>
        <div className={styles.roomInfo}>
          <p>
            ID комнаты: <span className={styles.roomId}>{paramRoomId}</span>
          </p>
        </div>

        <div className={styles.players}>
          <h3>Игроки в комнате ({players.length}/2):</h3>
          {players.length > 0 ? (
            players.map((p) => (
              <div key={p.id} className={styles.playerRow}>
                <p className={styles.playerItem}>
                  {p.userName} ({p.color})
                </p>
                {p.id === user.id && (
                  <button className={styles.readyButton}>Готов</button>
                )}
              </div>
            ))
          ) : (
            <p className={styles.noPlayers}>Ожидание игроков...</p>
          )}
        </div>

        <button className={styles.leaveButton} onClick={handleLeave}>
          Покинуть комнату
        </button>
      </div>
    </div>
  );
};

export default RoomPage;
