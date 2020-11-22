import React, { Fragment, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import PlayerCard from './components/PlayerCard';
import { getGameUrl } from '../../url';
import If from '../../components/If';
import { StreamContext } from '../../App';
import './LobbyPage.css';
import { Team } from '../../types/player';

export const LobbyPage = ({}) => {
  const history = useHistory();
  const context = useContext(StreamContext);
  const gameInfo = context.gameInfo;

  useEffect(() => {
    if (context.game) {
      history.push(getGameUrl(context.game.id));
    }
  }, [context.game]);

  return (
    <>
      {gameInfo && (
        <Fragment>
          <h2 className="pageTitle">{gameInfo.id}</h2>
          <div className="actionButtons">
            <button className="nextButton actionButton" onClick={() => navigator.clipboard.writeText(gameInfo.id)}>
              Copy
            </button>
            <button
              className="nextButton actionButton"
              onClick={() => {
                if (typeof window.navigator.share === 'function') {
                  navigator.share({ url: `${window.location.origin}/?joinRoom=${gameInfo.id}` });
                } else {
                  console.error('No navigator share here...');
                }
              }}
            >
              Share
            </button>
          </div>
          <div className="players">
            <div className="playersColumn">
              <h3 className="teamTitle">
                <span className="blue">Blue</span> Team
              </h3>
              {gameInfo.players
                .filter((p) => p.team === Team.BLUE)
                .map((player) => (
                  <PlayerCard player={player} key={player.id} />
                ))}
            </div>
            <div className="playersColumn">
              <h3 className="teamTitle">
                <span className="red">Red</span> Team
              </h3>

              {gameInfo.players
                .filter((p) => p.team === Team.RED)
                .map((player) => (
                  <PlayerCard player={player} key={player.id} />
                ))}
            </div>
          </div>

          <If
            condition={gameInfo.players.length < 2}
            then={() => <span className="atLeastLabel">At least 2 players are needed to start the game!</span>}
            else={() => (
              <button
                className="nextButton"
                onClick={() => {
                  if (context.gameSocket) {
                    context.gameSocket.startGame();
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
