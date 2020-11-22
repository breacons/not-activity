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
          <button className="nextButton" onClick={() => updateGame()}>
            New game
          </button>
          <button className="nextButton" onClick={() => setEnteredGameId('')}>
            Enter game
          </button>
        </Fragment>
      )}
      else={() => (
        <Fragment>
          <label className="userNameLabel">Enter room number</label>
          <div className="inputWrapper">
            <input className="userNameInput" onChange={(event) => setEnteredGameId(event.target.value)} />
          </div>
          <button
            className="nextButton"
            disabled={enteredGameId === ''}
            onClick={() => updateGame(enteredGameId as string)}
          >
            Enter
          </button>
        </Fragment>
      )}
    />
  );
};

export default SelectGame;
