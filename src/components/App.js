import { useState } from 'react';

import ParticipantList from './ParticipantList';
import GameBoard from './GameBoard';
import CarActions from './CarActions';
import { initialDataOfCars } from '../helpers';
import styles from '../styles/App.module.css';

function App() {
  const [cars, setCars] = useState(initialDataOfCars);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ParticipantList cars={cars} setCars={setCars} />
        <GameBoard cars={cars} />
        <CarActions cars={cars} setCars={setCars} />
      </div>
    </div>
  );
}

export default App;
