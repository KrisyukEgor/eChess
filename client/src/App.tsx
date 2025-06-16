import GamePage from "./pages/GamePage/GamePage"
import HomePage from "./pages/HomePage/HomePage"
import { RoutesEnum } from "./shared/utils/RoutesEnum"
import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./features/auth/context/AuthContext"
import { WebSocketProvider } from "./features/WebSocket/context/WebSocketContext"
import { RoomProvider } from "./features/room/context/RoomContext"
import LoginPage from "./pages/LoginPage/LoginPage"
import RegisterPage from "./pages/RegisterPage/RegisterPage"
import InvitePage from "./pages/InvitePage/InvitePage"
import RoomPage from "./pages/RoomPage/RoomPage"

function App() {

  return (
    <AuthProvider>
      <WebSocketProvider>
        <RoomProvider>
          <Routes>
            <Route path = {RoutesEnum.HomeRoute} element = {<HomePage></HomePage>}></Route>
            <Route path = {RoutesEnum.GameRoute} element = {<GamePage></GamePage>}></Route>
            <Route path = {RoutesEnum.LoginRoute} element = {<LoginPage></LoginPage>}></Route>
            <Route path = {RoutesEnum.InviteRoute} element = {<InvitePage></InvitePage>}></Route>
            <Route path = {RoutesEnum.RegisterRoute} element = {<RegisterPage></RegisterPage>}></Route>
            <Route path={`${RoutesEnum.Room}/:roomId`} element={<RoomPage></RoomPage>}></Route>
          </Routes>
        </RoomProvider>
      </WebSocketProvider>
    </AuthProvider>
  )
}

export default App
