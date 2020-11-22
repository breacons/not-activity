import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Player } from '../../types/player';
import EnterUserInfo from './components/EnterUserInfo';
import If from '../../components/If';
import SelectGame from './components/SelectGame';
import { useHistory, useLocation, useParams } from 'react-router';
import { getLobbyUrl } from '../../url';
import { StreamContext } from '../../App';
import styles from './StartPage.module.sass';
import logo from './image/logo.svg';

enum StartStep {
  USER_INFO = 'USER_INFO',
  SELECT_GAME = 'SELECT_GAME',
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const StartPage = () => {
  const [step, setStep] = useState(StartStep.USER_INFO);
  const [player, setPlayer] = useState({ name: '', emoji: '' });
  const history = useHistory();
  const context = useContext(StreamContext);
  const query = useQuery();

  useEffect(() => {
    const gameId = query.get('gameId');
    if (gameId) {
      updateGame(gameId);
    }
  }, []);

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
    <div className={styles.container}>
      <div className={styles.pageTitle}>
        <img src={logo} className={styles.logo} />
        <div className={styles.subTitle}>
            This is definitely <strong>not an online Activity</strong> game implemented with the dopest Web APIs. 🔥
        </div>
      </div>
      <div>
        <If
          condition={step === StartStep.USER_INFO}
          then={() => (
            <Fragment>
              <EnterUserInfo updatePlayer={updatePlayer} player={player} />
              <button
                className={styles.nextButton}
                disabled={!player.emoji || !player.name}
                onClick={() => setStep(StartStep.SELECT_GAME)}
              >
                Let's go!
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
    </div>
  );
};

export default StartPage;
