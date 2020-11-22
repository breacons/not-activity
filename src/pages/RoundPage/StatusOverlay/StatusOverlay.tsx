import React, { useContext, useEffect, useState } from 'react';
import { StreamContext } from '../../../App';

import styles from './StatusOverlay.module.sass';
import { Team } from '../../../types/player';
import { getTeamScore } from '../../../util/get-team-score';
import { RoundType } from '../../../types/game';
import If from '../../../components/If';
import { MAX_TIME_IN_SEC, ROUNDS_TO_WIN, STEAL_AFTER } from '../../../config';

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
      <div className={styles.personalInfo}>
        <div>
          {me?.team === Team.BLUE ? '🔵' : '🔴'}{' '}
          <span className={styles.name} style={{ color: me?.team === Team.RED ? '#F66689' : '#5E6EC4' }}>
            {me?.name}
          </span>
        </div>
      </div>
      <div className={styles.timer}>
        <div
          className={styles.timerProgress}
          style={{
            width: `${((round?.timeLeft || MAX_TIME_IN_SEC) * 100) / MAX_TIME_IN_SEC}%`,
            backgroundColor: round?.activePlayer.team === Team.RED ? '#F66689' : '#5E6EC4',
          }}
        />
      </div>
      <div
        style={{ color: round?.activePlayer.team === Team.RED ? '#F66689' : '#5E6EC4' }}
        className={styles.activePlayer}
      >
        {activePlayer?.name}'s turn
      </div>
      <If
        condition={me?.id === activePlayer.id}
        then={() => (
          <div className={styles.task}>
            {emoji[round?.roundType as RoundType]}&nbsp;&nbsp;&nbsp;{translation[round?.roundType as RoundType]}:{' '}
            <strong>{round?.answer}</strong>
          </div>
        )}
        else={() => (
          <div className={styles.task}>
            <If
              condition={me?.team === round?.activePlayer.team || round?.timeLeft <= STEAL_AFTER}
              then={() => <>🤔&nbsp;&nbsp;&nbsp;Guess what's this!</>}
              else={() => <>🤐&nbsp;&nbsp;&nbsp;{round?.timeLeft - STEAL_AFTER}s until you can steal!</>}
            />
          </div>
        )}
      />

      <div className={styles.leftBar} style={{ height: heights.red }} />
      <div className={styles.rightBar} style={{ height: heights.blue }} />
    </div>
  );
};

export default StatusOverlay;
