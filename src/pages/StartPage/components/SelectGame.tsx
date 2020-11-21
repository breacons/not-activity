import React, { Fragment, useState } from 'react';
import { Game } from '../../../types/game';
import If from '../../../components/If';

interface SelectGameProps {
  updateGame: (user: Partial<Game>) => void;
}

// TODO: game random string;
export const SelectGame = ({ updateGame }: SelectGameProps) => {
  const [enteredGameId, setEnteredGameId] = useState<string | null>(null);

  return (
    <If
      condition={enteredGameId === null}
      then={() => (
        <Fragment>
          <button onClick={() => updateGame({ id: 'RANDOM string' })}>New game</button>
          <button onClick={() => setEnteredGameId('')}>Enter game</button>
        </Fragment>
      )}
      else={() => (
        <Fragment>
          <label>Enter room number</label>
          <input onChange={(event) => setEnteredGameId(event.target.value)} />
          <button disabled={enteredGameId === ''} onClick={() => updateGame({ id: enteredGameId as string })}>
            Enter
          </button>
        </Fragment>
      )}
    />
  );
};

export default SelectGame;
