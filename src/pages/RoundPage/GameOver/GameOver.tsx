import React, { Fragment, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { StreamContext } from '../../../App';
import { URL_START } from '../../../url';
import { LeaderboardComponent } from '../../LobbyPage/components/Leaderboard';
import { getTeamScore } from '../../../util/get-team-score';
import If from '../../../components/If';
import { Team } from '../../../types/player';

import styles from '../../LobbyPage/LobbyPage.module.sass';

export const GameOver = () => {
  const { game, me } = useContext(StreamContext);

  const redScore = getTeamScore(Team.RED, game);
  const blueScore = getTeamScore(Team.BLUE, game);
  const tie = redScore === blueScore;
  const iAmWinner = !tie && redScore > blueScore && me?.team === Team.RED;

  const history = useHistory();
  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>
            <If condition={tie} then={() => "Wow! It's a tie 😳"} />
            <If
              condition={iAmWinner}
              then={() => `Nice! You and Team ${me?.team === Team.RED ? 'Red' : 'Blue'} won! 🏆`}
              else={() => `Oh snap, Team ${me?.team !== Team.RED ? 'Blue' : 'Red'} won 😕. How about a rematch?`}
            />
          </h1>
          <hr className={styles.divider} />
          {game && <LeaderboardComponent leaderboard={game?.leaderboard} />}
        </div>
        <button
          onClick={() => history.push(URL_START)}
          className={styles.nextButton}
          style={{ backgroundColor: me?.team === Team.RED ? '#F66689' : '#5E6EC4' }}
        >
          Play again!
        </button>
      </div>
    </Fragment>
  );
};
