import React from 'react';
import { Fragment, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { StreamContext } from '../../../App';
import { URL_START } from '../../../url';
import { LeaderboardComponent } from '../../LobbyPage/components/Leaderboard';

export const GameOver = () => {
  const { game } = useContext(StreamContext);

  const history = useHistory();
  return (
    <Fragment>
      <h2 className="pageTitle">Game Over</h2>
      {game && <LeaderboardComponent leaderboard={game?.leaderboard} />}

      <button className="nextButton" onClick={() => history.push(URL_START)}>
        Play Again
      </button>
    </Fragment>
  );
};
