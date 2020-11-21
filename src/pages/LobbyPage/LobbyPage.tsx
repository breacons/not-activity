import React, { Fragment, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import PlayerCard from './components/PlayerCard';
import { getGameUrl } from '../../url';
import If from '../../components/If';
import { StreamContext } from '../../App';


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
          <h2>Game: {gameInfo.id}</h2>
          <button onClick={() => navigator.clipboard.writeText(gameInfo.id)}>Copy</button>
          {gameInfo.players.map((player) => (
            <PlayerCard player={player} key={player.id} />
          ))}
          <If
            condition={gameInfo.players.length < 2}
            then={() => <span>At least 2 players are needed</span>}
            else={() => (
              <button
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
