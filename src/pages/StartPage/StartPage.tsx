import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Player } from '../../types/player';
import EnterUserInfo from './components/EnterUserInfo';
import If from '../../components/If';
import SelectGame from './components/SelectGame';
import { useHistory } from 'react-router';
import { getLobbyUrl } from '../../url';
import { StreamContext } from '../../App';
import './StartPage.css';

enum StartStep {
  USER_INFO = 'USER_INFO',
  SELECT_GAME = 'SELECT_GAME',
}


export const StartPage = () => {
  const [step, setStep] = useState(StartStep.SELECT_GAME);
  const [player, setPlayer] = useState({ name: 'Maro', emoji: '👆' });
  const history = useHistory();
  const context = useContext(StreamContext);

  const updatePlayer = (updatedPlayer: Partial<Player>) => {
    setPlayer({ ...player, ...updatedPlayer });
  };

  const updateGame = (id?: string) => {
    if (id && context.gameSocket) {
      context.gameSocket.joinGame(id, player.name, player.emoji);
    } else if (context.gameSocket) {
      context.gameSocket.createGame(player.name, undefined, player.emoji);
    }
  };

  useEffect(() => {
    if (context.gameInfo?.id) {
      // navigator.clipboard.writeText(context.gameInfo.id);
      history.push(getLobbyUrl(context.gameInfo.id));
    }
  }, [context.gameInfo]);

  return (
    <Fragment>
      <div className="pageTitle">
        <h1>
          This is <strong>not</strong> an Activity game
        </h1>
      </div>
      <div>
        <If
          condition={step === StartStep.USER_INFO}
          then={() => (
            <Fragment>
              <EnterUserInfo updatePlayer={updatePlayer} player={player} />
              <button
                className="nextButton"
                disabled={!player.emoji || !player.name}
                onClick={() => setStep(StartStep.SELECT_GAME)}
              >
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
