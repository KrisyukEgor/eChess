import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RoutesEnum } from "../../shared/utils/RoutesEnum";
import styles from "./InvitePage.module.css";
import { useRoomContext } from "../../features/room/context/RoomContext";

const InvitePage: React.FC = () => {
  const { roomId, players, roomError, createRoom, joinRoom } = useRoomContext();
  const navigate = useNavigate();

  const [joinCode, setJoinCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (roomId) {
      navigate(`${RoutesEnum.Room}/${roomId}`, { replace: true });
    }
  }, [roomId, navigate]);

  const handleCreate = useCallback(() => {
    setLocalError(null);
    createRoom();
  }, [createRoom]);

  const handleJoin = useCallback(() => {
    if (!joinCode.trim()) {
      setLocalError("Введите код комнаты");
      return;
    }
    setLocalError(null);
    joinRoom(joinCode.trim());
  }, [joinCode, joinRoom]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Пригласить друга в комнату</h2>

      {roomError && <div className={styles.error}>{roomError}</div>}
      {localError && <div className={styles.error}>{localError}</div>}

      {!roomId && (
        <div className={styles.controls}>
          <button onClick={handleCreate} className={styles.primaryButton}>
            Создать комнату
          </button>

          <div className={styles.joinSection}>
            <input
              type="text"
              placeholder="Код комнаты"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className={styles.input}
            />
            <button onClick={handleJoin} className={styles.secondaryButton}>
              Присоединиться
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitePage;
