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
  const [step, setStep] = useState(StartStep.USER_INFO);
  const [playerName, setPlayerName] = useState<string>('');
  const history = useHistory();
  const context = useContext(StreamContext);

  const updateGame = (id?: string) => {
    if (id && context.gameSocket) {
      context.gameSocket.joinGame(id, playerName);
    } else if (context.gameSocket) {
      context.gameSocket.createGame(playerName, undefined);
    }
  };

  useEffect(() => {
    if (context.gameInfo?.id) {
      navigator.clipboard.writeText(context.gameInfo.id);
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
              <EnterUserInfo updatePlayer={setPlayerName} />{' '}
              <button disabled={!playerName} onClick={() => setStep(StartStep.SELECT_GAME)}>
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
