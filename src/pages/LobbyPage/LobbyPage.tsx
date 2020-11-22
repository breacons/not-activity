import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { getGameUrl } from '../../url';
import If from '../../components/If';
import { StreamContext } from '../../App';
import { LeaderboardComponent } from './components/Leaderboard';

import styles from './LobbyPage.module.sass';
import { MINIMUM_PLAYERS } from '../../config';
import { Team } from '../../types/player';

export const LobbyPage = ({}) => {
  const history = useHistory();
  const { gameInfo, game, gameSocket, me } = useContext(StreamContext);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (game) {
      history.push(getGameUrl(game.id));
    }
  }, [game]);

  return (
    <>
      {gameInfo && (
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>
              Welcome {me?.name} to the Glorious{' '}
              <span style={{ color: me?.team === Team.RED ? '#F66689' : '#5E6EC4' }}>
                {me?.team === Team.RED ? 'Red' : 'Blue'} Team
              </span>
              !
            </h1>
            <p className={styles.description}>
              Share this ID with your friends so they can join you in conquering Team{' '}
              {me?.team !== Team.RED ? 'Red' : 'Blue'}:
            </p>
            <h3 className={styles.gameId}>
              <code className={styles.gameIdCode}>{gameInfo.id}</code>
            </h3>
            <div className={styles.actionButtons}>
              <button
                className={styles.actionButton}
                onClick={() => {
                  navigator.clipboard.writeText(gameInfo.id);
                  setCopied(true);
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                disabled={typeof window.navigator.share !== 'function'}
                className={styles.actionButton}
                onClick={() => {
                  if (typeof window.navigator.share === 'function') {
                    navigator.share({
                      url: `${window.location.origin}/${
                        window.location.pathname.split('/')[1]
                      }/index.html/start?gameId=${gameInfo.id}`,
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
            <hr className={styles.divider} />
            {gameInfo && <LeaderboardComponent leaderboard={gameInfo.leaderboard} />}
          </div>
          <button
            className={styles.nextButton}
            onClick={() => {
              if (gameSocket) {
                gameSocket.startGame();
              }
            }}
            disabled={gameInfo.players.length < MINIMUM_PLAYERS}
            style={{ backgroundColor: me?.team === Team.RED ? '#F66689' : '#5E6EC4' }}
          >
            <If
              condition={gameInfo.players.length < MINIMUM_PLAYERS}
              then={() =>
                `Waiting for ${MINIMUM_PLAYERS - gameInfo.players.length} more ${
                  MINIMUM_PLAYERS - gameInfo.players.length === 1 ? 'player' : 'players'
                }...`
              }
              else={() => 'Start Game'}
            />
          </button>
        </div>
      )}
    </>
  );
};

export default LobbyPage;
