import CarModel from './CarModel';
import Information from './Information';
import { Game } from '../helpers';
import styles from '../styles/GameBoard.module.css'

function GameBoard({ cars }) {
  return (
    <div className={styles.container}>
      <div
        className={styles.grid}
        style={{
          width: `${Game.cellWidth * Game.numberOfCellsHorizontally}px`,
          height: `${Game.cellHeight * Game.numberOfCellsVertically}px`,
          gridTemplateColumns: `repeat(${Game.numberOfCellsVertically}, ${Game.cellHeight}px)`,
          gridTemplateRows: `repeat(${Game.numberOfCellsHorizontally}, ${Game.cellWidth}px)`,
        }}
      >
        {new Array(64).fill().map((item, idx) => (
          <div
            key={idx}
            className={styles.cell}
            style={{ width: `${Game.cellWidth}px`, height: `${Game.cellHeight}px` }}
          />
        ))}
        {cars.map((car, idx) => (
          <CarModel key={idx} car={car} />
        ))}
      </div>
      <Information cars={cars} />
    </div>
  );
}

export default GameBoard;
