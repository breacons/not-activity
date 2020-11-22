import React, { Fragment, useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import PlayerCard from './components/PlayerCard';
import { getGameUrl } from '../../url';
import If from '../../components/If';
import { StreamContext } from '../../App';
import { LeaderboardComponent } from './components/Leaderboard';

import styles from './LobbyPage.module.sass';

export const LobbyPage = ({}) => {
  const history = useHistory();
  const { gameInfo, game, gameSocket } = useContext(StreamContext);

  useEffect(() => {
    if (game) {
      history.push(getGameUrl(game.id));
    }
  }, [game]);

  return (
    <>
      {gameInfo && (
        <Fragment>
          <h2 className={styles.pageTitle}>{gameInfo.id}</h2>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton} onClick={() => navigator.clipboard.writeText(gameInfo.id)}>
              Copy
            </button>
            <button
              className={styles.actionButton}
              onClick={() => {
                if (typeof window.navigator.share === 'function') {
                  navigator.share({
                    url: `${window.location.origin}/?gameId=${gameInfo.id}`,
                    text: 'Play Activity with me online!',
                  });
                } else {
                  console.error('No navigator share here...');
                }
              }}
            >
              Share
            </button>
          </div>
          {gameInfo && <LeaderboardComponent leaderboard={gameInfo.leaderboard} />}

          <If
            condition={gameInfo.players.length < 2}
            then={() => <span className={styles.atLeastLabel}>At least 2 players are needed to start the game!</span>}
            else={() => (
              <button
                className={styles.nextButton}
                onClick={() => {
                  if (gameSocket) {
                    gameSocket.startGame();
                  }
                }}
              >
                Start Game
              </button>
            )}
          />
        </Fragment>
      )}
    </>
  );
};

export default LobbyPage;
