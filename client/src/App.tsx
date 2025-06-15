import GamePage from "./pages/GamePage/GamePage"
import HomePage from "./pages/HomePage/HomePage"
import { RoutesEnum } from "./shared/utils/RoutesEnum"
import { Routes, Route } from "react-router-dom"

function App() {

  return (
    <Routes>
      <Route path = {RoutesEnum.HomeRoute} element = {<HomePage></HomePage>}></Route>
      <Route path = {RoutesEnum.GameRoute} element = {<GamePage></GamePage>}></Route>
    </Routes>
  )
}

export default App
