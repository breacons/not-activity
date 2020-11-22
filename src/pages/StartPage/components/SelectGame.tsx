import React, { Fragment, useState } from 'react';
import If from '../../../components/If';

interface SelectGameProps {
  updateGame: (gameId?: string) => void;
}

export const SelectGame = ({ updateGame }: SelectGameProps) => {
  const [enteredGameId, setEnteredGameId] = useState<string | null>(null);

  return (
    <If
      condition={enteredGameId === null}
      then={() => (
        <Fragment>
          <button onClick={() => updateGame()}>New game</button>
          <button onClick={() => setEnteredGameId('')}>Enter game</button>
        </Fragment>
      )}
      else={() => (
        <Fragment>
          <label>Enter room number</label>
          <input onChange={(event) => setEnteredGameId(event.target.value)} />
          <button disabled={enteredGameId === ''} onClick={() => updateGame(enteredGameId as string)}>
            Enter
          </button>
        </Fragment>
      )}
    />
  );
};

export default SelectGame;
