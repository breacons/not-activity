import React, { useContext, Fragment, useEffect, useRef, useState } from 'react';
import { StreamContext } from '../../App';
import PresentInRound from './PresentInRound';
import WaitInRound from './WaitInRound';
import StatusOverlay from './StatusOverlay';

import If from '../../components/If';
import { GameOver } from './GameOver';
import Reward from 'react-rewards';

export const RoundContainer = () => {
  const { round, me, game, solutions } = useContext(StreamContext);
  const [rewardType, setRewardType] = useState<'emoji' | 'confetti'>('confetti');
  const reward = useRef(null);

  useEffect(() => {
    const latestSolution = solutions.pop();
    if (latestSolution && latestSolution.sender === me?.id) {
      if (latestSolution.isCorrect) {
        console.log('Correct solution!');
        if (reward && reward.current) {
          setRewardType('confetti');
          setTimeout(() => (reward as any).current.rewardMe(), 100);
        }
      } else {
        console.log('Wrong solution');
        if (reward && reward.current) {
          setRewardType('emoji');
          setTimeout(() => (reward as any).current.rewardMe(), 100);
        }
      }
    }
  }, [solutions]);

  if (!round) {
    return <span>Loading...</span>;
  }

  const activePlayer = round.activePlayer;

  if (game?.isOver) {
    return <GameOver />;
  }

  return (
    <Fragment>
      <StatusOverlay />
      <If condition={me?.id === activePlayer.id} then={() => <PresentInRound />} else={() => <WaitInRound />} />
      <Reward ref={reward} type={rewardType} config={{ emoji: ['🤯'] }}>
        <button style={{ height: 0, width: 0, position: 'fixed', bottom: 0, left: '50%', visibility: 'hidden' }} />
      </Reward>
    </Fragment>
  );
};

export default RoundContainer;
