import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Player } from '../../types/player';
import EnterUserInfo from './components/EnterUserInfo';
import If from '../../components/If';
import SelectGame from './components/SelectGame';
import { useHistory } from 'react-router';
import { getLobbyUrl } from '../../url';
import { StreamContext } from '../../App';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface StartPageProps {}

enum StartStep {
  USER_INFO = 'USER_INFO',
  SELECT_GAME = 'SELECT_GAME',
  GAME_INFO = 'GAME_INFO',
}

export const StartPage = ({}: StartPageProps) => {
  const [player, setPlayer] = useState<Player>({ name: '22', emoji: '22' });
  const [step, setStep] = useState(StartStep.SELECT_GAME);

  const history = useHistory();
  const context = useContext(StreamContext);

  const updatePlayer = (updatedPlayer: Partial<Player>) => {
    setPlayer({ ...player, ...updatedPlayer });
  };

  const updateGame = (id?: string) => {
    if (id && context.gameSocket) {
      context.gameSocket.joinGame(id, player.name);
    } else if (context.gameSocket) {
      context.gameSocket.createGame(player.name, undefined);
    }
  };

  useEffect(() => {
    if (context.gameInfo?.id) {
      history.push(getLobbyUrl(context.gameInfo.id));
    }
  }, [context.gameInfo]);

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
