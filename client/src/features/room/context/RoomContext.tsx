import { createContext, useContext } from "react";
import { useRoom } from "../../room/hooks/useRoom";

const RoomContext = createContext<ReturnType<typeof useRoom> | null>(null);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const room = useRoom();
  return <RoomContext.Provider value={room}>{children}</RoomContext.Provider>;
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within RoomProvider");
  }
  return context;
};
