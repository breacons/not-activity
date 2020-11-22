import React, { Fragment, useContext, useEffect, useState } from 'react';
import { StreamContext } from '../../../App';

import styles from './StatusOverlay.module.sass';
import { Team } from '../../../types/player';
import { getTeamScore } from '../../../util/get-team-score';
import { RoundType } from '../../../types/game';
import If from '../../../components/If';

const ROUNDS_TO_WIN = 5;
const MAX_TIME_IN_SEC = 60;

const translation = {
  [RoundType.show]: 'Show',
  [RoundType.draw]: 'Draw',
  [RoundType.talk]: 'Paraphrase',
};

const emoji = {
  [RoundType.show]: '👋',
  [RoundType.draw]: '✏️',
  [RoundType.talk]: '💬',
};

export const StatusOverlay = () => {
  const { round, me, game } = useContext(StreamContext);

  const [heights, setHeights] = useState({ red: 10, blue: 10 });

  useEffect(() => {
    const calculateHeight = (team: Team) => {
      const score = getTeamScore(team, game);
      const progress = score / ROUNDS_TO_WIN;

      return Math.max(window.innerHeight * progress, 30);
    };

    setHeights({ blue: calculateHeight(Team.BLUE), red: calculateHeight(Team.RED) });
  }, [game]);

  if (!round) return null;
  const activePlayer = round?.activePlayer;

  return (
    <div className={styles.container}>
      <div className={styles.timer}>
        <div
          className={styles.timerProgress}
          style={{ width: `${((round?.timeLeft || MAX_TIME_IN_SEC) * 100) / MAX_TIME_IN_SEC}%` }}
        />
      </div>
      <If
        condition={me?.id === activePlayer.id}
        then={() => (
          <div className={styles.task}>
            {emoji[round?.roundType as RoundType]}&nbsp;&nbsp;{translation[round?.roundType as RoundType]}:{' '}
            <strong>{round?.answer}</strong>
          </div>
        )}
      />

      <div className={styles.leftBar} style={{ height: heights.red }} />
      <div className={styles.rightBar} style={{ height: heights.blue }} />
    </div>
  );
};

export default StatusOverlay;
