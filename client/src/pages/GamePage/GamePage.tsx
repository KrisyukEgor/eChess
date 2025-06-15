
import { Color } from '../../../chess/src/Core/Enums/Color'
import { BoardComponent } from '../../features/chess/components/BoardComponent/BoardComponent';

function GamePage() {
  return (
    <div>
        <BoardComponent side = {Color.WHITE}></BoardComponent>
    </div>
  )
}

export default GamePage