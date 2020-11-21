import React, { Fragment, useEffect, useState } from 'react';
import { Player } from '../../types/player';
import EnterUserInfo from './components/EnterUserInfo';
import If from '../../components/If';
import SelectGame from './components/SelectGame';
import { Game } from '../../types/game';
import { useHistory } from 'react-router';
import { getLobbyUrl } from '../../url';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface StartPageProps {}

enum StartStep {
  USER_INFO = 'USER_INFO',
  SELECT_GAME = 'SELECT_GAME',
  GAME_INFO = 'GAME_INFO',
}

export const StartPage = ({}: StartPageProps) => {
  const [player, setPlayer] = useState<Player>({ name: '22', emoji: '22' });
  const [game, setGame] = useState<Game>({ id: '' });
  const [step, setStep] = useState(StartStep.SELECT_GAME);

  const history = useHistory();

  const updatePlayer = (updatedPlayer: Partial<Player>) => {
    setPlayer({ ...player, ...updatedPlayer });
  };

  const updateGame = (updatedGame: Partial<Game>) => {
    setGame({ ...game, ...updatedGame });
  };

  useEffect(() => {
    if (game.id) {
      history.push(getLobbyUrl(game.id));
    }
  }, [game]);

  return (
    <Fragment>
      <div>
        This is <strong>not</strong> an Activity game
      </div>
      <div>
        <If
          condition={step === StartStep.USER_INFO}
          then={() => (
            <Fragment>
              <EnterUserInfo updatePlayer={updatePlayer} />{' '}
              <button disabled={!player.name || !player.emoji} onClick={() => setStep(StartStep.SELECT_GAME)}>
                Next
              </button>
            </Fragment>
          )}
        />
        <If
          condition={step === StartStep.SELECT_GAME}
          then={() => (
            <Fragment>
              <SelectGame updateGame={updateGame} />
            </Fragment>
          )}
        />
      </div>
    </Fragment>
  );
};

export default StartPage;
