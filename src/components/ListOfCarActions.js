import { useState } from 'react';

import { Game, Car } from '../helpers';
import styles from '../styles/ListOfCarActions.module.css';

function ListOfCarActions({ cars, setCars }) {
  const [offenderBeforeMove, setOffenderBeforeMove] = useState(null);
  const [isCarCrash, setIsCarCrash] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const selectedCar = cars.find(item => item.isTurn);

  const makeMove = (updatedCar) => {
    let copy = [...cars];
    copy[updatedCar.index] = { ...updatedCar, isTurn: false };
    copy = copy.map(c => {
      let rowIndex;
      let colIndex;

      if (updatedCar.index === c.index) {
        return c;
      }

      switch(c.direction) {
        case Car.Direction.up:
        case Car.Direction.down:
          rowIndex = c.coordinate.top / Game.cellHeight;
          colIndex = c.coordinate.left / Game.cellWidth;
          return {
            ...c,
            onCells: [
              `row${rowIndex + 1},col${colIndex + 1}`,
              `row${rowIndex + 2},col${colIndex + 1}`,
            ],
          };
        case Car.Direction.left:
        case Car.Direction.right:
          rowIndex = (c.coordinate.top + Car.width / 2) / Game.cellHeight;
          colIndex = (c.coordinate.left - Car.height / 4) / Game.cellWidth;
          return {
            ...c,
            onCells: [
              `row${rowIndex + 1},col${colIndex + 1}`,
              `row${rowIndex + 1},col${colIndex + 2}`,
            ],
          };
      }
    });
    let offender = null;
    let victim = null;
    let isCrash = false;
    copy[updatedCar.index].moves.some(move => {
      copy.some(c => {
        if (updatedCar.index !== c.index && c.onCells.includes(move)) {
          isCrash = true;
          offender = copy[updatedCar.index];
          victim = c;
        }

        return isCrash;
      });

      return isCrash;
    });

    if (isCrash) {
      copy[offender.index] = { ...offender, penalty: offender.penalty + 2 };
      copy[victim.index] = { ...victim, penalty: victim.penalty + 1 };
    }

    let nextCar = copy.slice(updatedCar.index + 1).find(c => c.penalty === 0);

    if (nextCar) {
      copy[nextCar.index] = { ...nextCar, isTurn: true };
    } else {
      copy = copy.map(c => ({ ...c, penalty: c.penalty > 0 ? c.penalty - 1 : 0 }));
      nextCar = copy.find(c => c.penalty === 0);

      if (!nextCar) {
        setIsGameOver(true);
      } else {
        copy[nextCar.index] = { ...nextCar, isTurn: true };
      }
    }

    if (isCrash) {
      setOffenderBeforeMove({ ...selectedCar });
      setCars(copy);
      setIsCarCrash(true);
    } else {
      setCars(copy);
    }
  };

  const isCarWithinBorders = (car) => {
    if (!car) return false;

    switch(car.direction) {
      case Car.Direction.up:
      case Car.Direction.down:
        return car.coordinate.top >= Game.border.top
          && car.coordinate.top <= Game.border.bottom - Car.height
          && car.coordinate.left >= Game.border.left
          && car.coordinate.left <= Game.border.right - Car.width;
      case Car.Direction.left:
      case Car.Direction.right:
        return car.coordinate.top >= Game.border.top - Car.width / 2
          && car.coordinate.top <= Game.border.bottom - Car.height + Car.width / 2
          && car.coordinate.left >= Game.border.left + Car.height / 4
          && car.coordinate.left <= Game.border.right- Car.width - Car.height / 4;
    }
  };

  const goForward = (numberOfSteps) => {
    const updatedCar = Car.calcStepsForward(selectedCar, numberOfSteps);
    makeMove(updatedCar);
  };

  const canGoForward = (numberOfSteps) => {
    const updatedCar = Car.calcStepsForward(selectedCar, numberOfSteps);
    return isCarWithinBorders(updatedCar);
  };

  const goOneStepBack = () => {
    const updatedCar = Car.calcOneStepBack(selectedCar);
    makeMove(updatedCar);
  };

  const canGoOneStepBack = () => {
    const updatedCar = Car.calcOneStepBack(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const goToLeftLane = () => {
    const updatedCar = Car.calcStepToLeftLane(selectedCar);
    makeMove(updatedCar);
  };

  const canGoToLeftLane = () => {
    const updatedCar = Car.calcStepToLeftLane(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const goToRightLane = () => {
    const updatedCar = Car.calcStepToRightLane(selectedCar);
    makeMove(updatedCar);
  };

  const canGoToRightLane = () => {
    const updatedCar = Car.calcStepToRightLane(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const turnForwardLeft = () => {
    const updatedCar = Car.calcTurnForwardLeft(selectedCar);
    makeMove(updatedCar);
  };

  const canTurnForwardLeft = () => {
    const updatedCar = Car.calcTurnForwardLeft(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const turnForwardRight = () => {
    const updatedCar = Car.calcTurnForwardRight(selectedCar);
    makeMove(updatedCar);
  };

  const canTurnForwardRight = () => {
    const updatedCar = Car.calcTurnForwardRight(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const turnBackLeft = () => {
    const updatedCar = Car.calcTurnBackLeft(selectedCar);
    makeMove(updatedCar);
  };

  const canTurnBackLeft = () => {
    const updatedCar = Car.calcTurnBackLeft(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const turnBackRight = () => {
    const updatedCar = Car.calcTurnBackRight(selectedCar);
    makeMove(updatedCar);
  };

  const canTurnBackRight = () => {
    const updatedCar = Car.calcTurnBackRight(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const handleCarCrash = () => {
    const copy = [...cars];
    copy[offenderBeforeMove.index] = {
      ...copy[offenderBeforeMove.index],
      direction: offenderBeforeMove.direction,
      coordinate: offenderBeforeMove.coordinate,
    };
    delete copy[offenderBeforeMove.index].moves;
    setOffenderBeforeMove(null);
    setCars(copy);
    setIsCarCrash(false);
  };

  return (
    <>
      {isCarCrash || isGameOver ? <div className={styles.toastBg} /> : null}

      <div className={styles.container}>
        <div className={styles.grid}>
          <button
            className={styles.item1}
            onClick={turnForwardLeft}
            disabled={!canTurnForwardLeft()}
          >
            &#8624;
          </button>
          <button
            className={styles.item2}
            onClick={turnForwardRight}
            disabled={!canTurnForwardRight()}
          >
            &#8625;
          </button>

          <button
            className={styles.item3}
            onClick={() => goForward(3)}
            disabled={!canGoForward(3)}
          >
            &#8593;&#8593;&#8593;
          </button>
          <button
            className={styles.item4}
            onClick={() => goForward(2)}
            disabled={!canGoForward(2)}
          >
            &#8593;&#8593;
          </button>
          <button
            className={styles.item5}
            onClick={() => goForward(1)}
            disabled={!canGoForward(1)}
          >
            &#8593;
          </button>

          <button
            className={styles.item6}
            onClick={goToLeftLane}
            disabled={!canGoToLeftLane()}
          >
            &#8598;
          </button>
          <button
            className={styles.item7}
            onClick={goToRightLane}
            disabled={!canGoToRightLane()}
          >
            &#8599;
          </button>

          <div className={styles.item8}>{selectedCar?.number}</div>

          <button
            className={styles.item9}
            onClick={goOneStepBack}
            disabled={!canGoOneStepBack()}
          >
            &#8595;
          </button>

          <button
            className={styles.item10}
            onClick={turnBackLeft}
            disabled={!canTurnBackLeft()}
          >
            &#8629;
          </button>
          <button
            className={styles.item11}
            onClick={turnBackRight}
            disabled={!canTurnBackRight()}
          >
            &#8627;
          </button>
        </div>

        {isCarCrash && (
          <div className={styles.toastCarCrash}>
            <div className={styles.toastTitle}>Car crash</div>
            <button className={styles.toastBtn} onClick={handleCarCrash}>&#128110;</button>
          </div>
        )}
      </div>
      {isGameOver && (
        <div className={styles.toastGameOver}>
          <div className={styles.toastTitle}>Game over</div>
          <button className={styles.toastBtn} disabled>&#10060;</button>
        </div>
      )}
    </>
  );
}

export default ListOfCarActions;
