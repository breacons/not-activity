import React, { Fragment, useState } from 'react';
import If from '../../../components/If';

import styles from '../StartPage.module.sass';
import enterStyles from './EnterUserInfo.module.sass';

interface SelectGameProps {
  updateGame: (gameId?: string) => void;
}

export const SelectGame = ({ updateGame }: SelectGameProps) => {
  const [enteredGameId, setEnteredGameId] = useState<string | null>(null);
  const [wrongCode, setWongCode] = useState(false);

  const enterGame = () => {
    updateGame(enteredGameId as string);

    setTimeout(() => {
      setWongCode(true);
    });
  };

  return (
    <If
      condition={enteredGameId === null}
      then={() => (
        <Fragment>
          <button className={styles.nextButton} onClick={() => updateGame()}>
            Create new game
          </button>
          <button className={styles.nextButton} onClick={() => setEnteredGameId('')}>
            Enter existing game
          </button>
        </Fragment>
      )}
      else={() => (
        <Fragment>
          <label className={enterStyles.userNameLabel}>What's your game number?</label>
          <div className={enterStyles.inputWrapper}>
            <input
              placeholder="winning-team"
              className={enterStyles.userNameInput}
              onChange={(event) => {
                setEnteredGameId(event.target.value);
                setWongCode(false);
              }}
            />
          </div>
          <button className={styles.nextButton} disabled={enteredGameId === ''} onClick={() => enterGame()}>
            {wrongCode ? 'Oppsie. No such game!' : 'Step into the game!'}
          </button>
        </Fragment>
      )}
    />
  );
};

export default SelectGame;
